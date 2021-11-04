import { toVFile, write } from 'to-vfile';
import { mkdirp } from 'vfile-mkdirp';
import { rename } from 'vfile-rename';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import LayoutsCache from '../gen/layouts-cache.js';
import globVFiles from '../gen/glob-vfiles.js';
export default class Generator {
    constructor(config) {
        this.config = config;
        this.layouts = new LayoutsCache('layouts');
    }
    async generateAll() {
        for (const src of await globVFiles('content/**/*.md')) {
            console.log(src);
            const out = this.getOutPath(src);
            await this.generateMarkdown(src, out);
        }
    }
    getOutPath(src) {
        return rename(toVFile(src), [
            { dirname: { prefix: this.config.outDir } },
            '.html',
        ]);
    }
    async generateMarkdown(src, out) {
        const output = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(src);
        console.error(reporter(output));
        const context = { content: String(output) };
        console.log(context);
        this.generateHandlebars('article', context, out);
    }
    async generateHandlebars(layout, context, out) {
        const compile = await this.layouts.findLayout(layout);
        out.value = compile(context);
        await mkdirp(out);
        await write(out);
    }
}
