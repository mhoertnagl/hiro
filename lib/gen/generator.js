import { toVFile, write, read } from 'to-vfile';
import { mkdirp } from 'vfile-mkdirp';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import LayoutsCache from '../gen/layouts-cache.js';
import globFiles from '../gen/glob-files.js';
import { join, parse } from 'path';
export default class Generator {
    constructor(config) {
        this.config = config;
        this.layouts = new LayoutsCache('layouts');
    }
    async generateAll() {
        for (const src of await globFiles('content/**/*.md')) {
            console.log(src);
            const out = this.getOutPath(src);
            console.log(out);
            await this.generateMarkdown(src, out);
        }
    }
    getOutPath(src) {
        const { dir, name } = parse(src);
        return join(this.config.outDir, dir, `${name}.html`);
    }
    async generateMarkdown(src, out) {
        const input = await read(src);
        const output = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(input);
        console.error(reporter(output));
        const context = { content: String(output) };
        console.log(context);
        this.generateHandlebars('article', context, out);
    }
    async generateHandlebars(layout, context, out) {
        const file = toVFile(out);
        const compile = await this.layouts.findLayout(layout);
        file.value = compile(context);
        await mkdirp(file);
        await write(file);
    }
}
