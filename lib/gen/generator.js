import fs from 'fs-extra';
import { join, parse } from 'path';
import { toVFile, write, read } from 'to-vfile';
import { matter } from 'vfile-matter';
import { mkdirp } from 'vfile-mkdirp';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';
import LayoutsCache from '../gen/layouts-cache.js';
import globFiles from '../gen/glob-files.js';
export default class Generator {
    constructor(config) {
        this.config = config;
        this.layouts = new LayoutsCache('layouts');
        this.pages = [];
    }
    async generateAll() {
        await this.generateAllContent();
        await this.generateIndex();
        await this.copyAssets();
    }
    async generateAllContent() {
        this.layouts.clear();
        for (const src of await globFiles('content/**/*.md')) {
            await this.generateContent(src);
        }
    }
    generateContent(src) {
        const out = this.getOutPath(src);
        return this.generateMarkdown(src, out);
    }
    async generateMarkdown(src, out) {
        const input = await read(src);
        matter(input, { strip: true });
        const readTime = readingTime(String(input));
        const output = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeHighlight)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(input);
        console.error(reporter(output));
        const context = {
            path: this.getRelativeOutPath(src),
            matter: output.data.matter,
            readTime: readTime,
            content: String(output),
        };
        this.addOrUpdatePageContext(context);
        this.generateHandlebars(context.matter.layout, context, out);
    }
    addOrUpdatePageContext(context) {
        const existing = this.pages.find((c) => c.path === context.path);
        if (existing) {
            Object.assign(existing, context);
        }
        else {
            this.pages.push(context);
        }
    }
    async generateIndex() {
        const context = { pages: this.pages };
        const out = join(this.config.outDir, 'index.html');
        this.generateHandlebars('index', context, out);
    }
    getOutPath(src) {
        const { dir, name } = parse(src);
        return join(this.config.outDir, dir, `${name}.html`);
    }
    getRelativeOutPath(src) {
        const { dir, name } = parse(src);
        return join(dir, `${name}.html`);
    }
    async generateHandlebars(layout, context, out) {
        const compile = await this.layouts.findLayout(layout);
        const file = toVFile({ path: out, value: compile(context) });
        await mkdirp(file);
        await write(file);
    }
    copyAssets() {
        return this.copyFolder('public', this.config.outDir);
    }
    async copyFolder(src, out) {
        await fs.copy(src, out, {
            recursive: true,
            overwrite: true,
            errorOnExist: false,
        });
    }
}
