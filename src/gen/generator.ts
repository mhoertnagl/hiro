import { toVFile, write, read } from 'to-vfile'
import { matter } from 'vfile-matter'
import { mkdirp } from 'vfile-mkdirp'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import readingTime, { ReadTimeResults } from 'reading-time'
import { join, parse } from 'path'

import LayoutsCache from '@/gen/layouts-cache.js'
import globFiles from '@/gen/glob-files.js'
import HiroConfig from '@/config/hiro-config'

export default class Generator {
  private readonly config: HiroConfig
  private readonly layouts: LayoutsCache

  constructor(config: HiroConfig) {
    this.config = config
    this.layouts = new LayoutsCache('layouts')
  }

  public async generateAll() {
    for (const src of await globFiles('content/**/*.md')) {
      const out = this.getOutPath(src)
      await this.generateMarkdown(src, out)
    }
  }

  private getOutPath(src: string) {
    const { dir, name } = parse(src)
    return join(this.config.outDir, dir, `${name}.html`)
  }

  // https://github.com/vfile/vfile-reporter-pretty
  public async generateMarkdown(src: string, out: string) {
    const input = await read(src)

    matter(input, { strip: true })

    const readTime = readingTime(String(input))

    const output = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(input)

    console.error(reporter(output))

    const context: MarkdownContext = {
      matter: output.data.matter as MarkdownFrontmatter,
      readTime: readTime,
      content: String(output),
    }

    this.generateHandlebars(context.matter.layout, context, out)
  }

  public async generateHandlebars(
    layout: string,
    context: object,
    out: string
  ) {
    const compile = await this.layouts.findLayout(layout)
    const file = toVFile({ path: out, value: compile(context) })
    await mkdirp(file)
    await write(file)
  }
}

interface MarkdownContext {
  matter: MarkdownFrontmatter
  readTime: ReadTimeResults
  content: string
}

interface MarkdownFrontmatter {
  layout: string
}
