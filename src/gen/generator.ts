import fs from 'fs-extra'
import { join, parse } from 'path'
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

import LayoutsCache from '@/gen/layouts-cache.js'
import globFiles from '@/gen/glob-files.js'
import HiroConfig from '@/config/hiro-config'

export default class Generator {
  private readonly config: HiroConfig
  private readonly layouts: LayoutsCache
  private readonly pages: MarkdownContext[]

  constructor(config: HiroConfig) {
    this.config = config
    this.layouts = new LayoutsCache('layouts')
    this.pages = []
  }

  public async generateAll() {
    await this.generateAllMarkdown()
    await this.generateIndex()
  }

  private async generateAllMarkdown() {
    for (const src of await globFiles('content/**/*.md')) {
      const out = this.getOutPath(src)
      await this.generateMarkdown(src, out)
    }
  }

  private async generateIndex() {
    const context = { pages: this.pages }
    const out = join(this.config.outDir, 'index.html')
    this.generateHandlebars('index', context, out)
  }

  private sortPagesByDateDesc() {
    this.pages.sort((a, b) => {
      const da = a.matter.date
      const db = b.matter.date
      return da < db ? 1 : da > db ? -1 : 0
    })
  }

  private getOutPath(src: string) {
    const { dir, name } = parse(src)
    return join(this.config.outDir, dir, `${name}.html`)
  }

  private getRelativeOutPath(src: string) {
    const { dir, name } = parse(src)
    return join(dir, `${name}.html`)
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
      path: this.getRelativeOutPath(src),
      matter: output.data.matter as MarkdownFrontmatter,
      readTime: readTime,
      content: String(output),
    }

    this.pages.push(context)

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

  public async copyFolder(src: string, out: string) {
    await fs.copy(src, out, {
      recursive: true,
      overwrite: true,
    })
  }
}

interface MarkdownContext {
  path: string
  matter: MarkdownFrontmatter
  readTime: ReadTimeResults
  content: string
}

interface MarkdownFrontmatter {
  layout: string
  title: string
  synopsis: string
  date: Date
}
