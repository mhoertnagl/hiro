import { ext } from '../utils/file-paths.js';
export default class PageContexts {
    constructor() {
        this.pages = [];
    }
    get() {
        return this.pages;
    }
    set(src, output) {
        return this.setContext({
            path: ext(src, '.html'),
            matter: output.data.matter,
            readTime: output.data.readTime,
            content: String(output),
        });
    }
    setContext(context) {
        const existing = this.pages.find((c) => c.path === context.path);
        if (existing) {
            Object.assign(existing, context);
        }
        else {
            this.pages.push(context);
        }
        return context;
    }
}
