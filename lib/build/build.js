import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'rehype-stringify';
export default async function () {
    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(remarkStringify);
    const output = await processor.process('# Test');
    console.error(reporter(output));
    console.log(String(output));
}
