import { reporter, VFile } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'

export default async function compileMarkdown(input: string) {
  const output = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkStringify)
    .process(input)

  console.error(reporter(output))

  const res = new MarkdownCompilationResult()
  res.matter = {}
  res.content = output
  return res
}

class MarkdownCompilationResult {
  matter: object
  content: VFile
}
