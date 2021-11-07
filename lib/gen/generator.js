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
        await this.generateAllMarkdown();
        this.sortPagesByDateDesc();
        await this.generateIndex();
        await this.copyFolder('public', this.config.outDir);
    }
    async generateAllMarkdown() {
        for (const src of await globFiles('content/**/*.md')) {
            const out = this.getOutPath(src);
            await this.generateMarkdown(src, out);
        }
    }
    async generateIndex() {
        const context = { pages: this.pages };
        const out = join(this.config.outDir, 'index.html');
        this.generateHandlebars('index', context, out);
    }
    sortPagesByDateDesc() {
        this.pages.sort((a, b) => {
            const da = a.matter.date;
            const db = b.matter.date;
            return da < db ? 1 : da > db ? -1 : 0;
        });
    }
    getOutPath(src) {
        const { dir, name } = parse(src);
        return join(this.config.outDir, dir, `${name}.html`);
    }
    getRelativeOutPath(src) {
        const { dir, name } = parse(src);
        return join(dir, `${name}.html`);
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
        this.pages.push(context);
        this.generateHandlebars(context.matter.layout, context, out);
    }
    async generateHandlebars(layout, context, out) {
        const compile = await this.layouts.findLayout(layout);
        const file = toVFile({ path: out, value: compile(context) });
        await mkdirp(file);
        await write(file);
    }
    async copyFolder(src, out) {
        await fs.copy(src, out, {
            recursive: true,
            overwrite: true,
            errorOnExist: false,
        });
    }
}
