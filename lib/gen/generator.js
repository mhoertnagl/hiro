import fs from 'fs-extra';
import { join } from 'path';
import { toVFile, write, read } from 'to-vfile';
import { mkdirp } from 'vfile-mkdirp';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import LayoutsCache from '../gen/layouts-cache.js';
import PageContexts from './page-contexts.js';
import globFiles from '../gen/glob-files.js';
import frontMatter from '../gen/plugins/front-matter.js';
import readingTime from './plugins/reading-time.js';
import { ext, superdir } from '../utils/file-paths.js';
export default class Generator {
    constructor(config) {
        this.config = config;
        this.layouts = new LayoutsCache('layouts');
        this.pages = new PageContexts();
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
        const out = superdir(this.config.outDir, ext(src, '.html'));
        return this.generateMarkdown(src, out);
    }
    async generateMarkdown(src, out) {
        const input = await read(src);
        const output = await this.processMarkdown(input);
        const context = this.pages.set(src, output);
        console.error(reporter(output));
        this.generateHandlebars(context.matter.layout, context, out);
    }
    processMarkdown(input) {
        return unified()
            .use(frontMatter)
            .use(readingTime)
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeHighlight)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(input);
    }
    async generateIndex() {
        const context = { pages: this.pages.get() };
        const out = join(this.config.outDir, 'index.html');
        this.generateHandlebars('index', context, out);
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
