import fs from 'fs-extra';
import { join } from 'path';
import handlebars from 'handlebars';
import registerFormatDate from '../gen/helpers/format-date.js';
export default class LayoutsCache {
    constructor(root) {
        this.root = root;
        this.layouts = new LayoutsMap();
        registerFormatDate();
    }
    async findLayout(name) {
        if (this.layouts.has(name) === false) {
            const layout = await this.loadLayout(name);
            this.layouts.set(name, layout);
        }
        return this.layouts.get(name);
    }
    async loadLayout(name) {
        const path = join(this.root, `${name}.handlebars`);
        const source = await fs.readFile(path, 'utf8');
        return handlebars.compile(source);
    }
    clear() {
        this.layouts.clear();
    }
}
class LayoutsMap extends Map {
}
