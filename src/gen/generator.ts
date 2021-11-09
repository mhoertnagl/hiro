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
import readingTime from 'reading-time'
import { ReadTimeResults } from 'reading-time'

import LayoutsCache from '@/gen/layouts-cache.js'
import globFiles from '@/gen/glob-files.js'
import HiroConfig from '@/config/hiro-config.js'
import { ext, superdir } from '@/utils/file-paths.js'

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
    await this.generateAllContent()
    await this.generateIndex()
    await this.copyAssets()
  }

  public async generateAllContent() {
    this.layouts.clear()
    for (const src of await globFiles('content/**/*.md')) {
      await this.generateContent(src)
    }
  }

  public generateContent(src: string) {
    const out = superdir(this.config.outDir, ext(src, '.html'))
    return this.generateMarkdown(src, out)
  }

  // https://github.com/vfile/vfile-reporter-pretty
  private async generateMarkdown(src: string, out: string) {
    const input = await read(src)

    // TODO: Use as unified plugin or create one.
    matter(input, { strip: true })

    // TODO: Create plugin.
    const readTime = readingTime(String(input))

    // TODO: Katex support.
    // TODO: Comments plugin.
    // TODO: Hints, Warnings plugin.
    const output = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(input)

    console.error(reporter(output))

    const context: MarkdownContext = {
      path: ext(src, '.html'),
      matter: output.data.matter as MarkdownFrontmatter,
      readTime: readTime,
      content: String(output),
    }

    this.addOrUpdatePageContext(context)

    this.generateHandlebars(context.matter.layout, context, out)
  }

  private addOrUpdatePageContext(context: MarkdownContext) {
    const existing = this.pages.find((c) => c.path === context.path)
    if (existing) {
      Object.assign(existing, context)
    } else {
      this.pages.push(context)
    }
  }

  public async generateIndex() {
    const context = { pages: this.pages }
    const out = join(this.config.outDir, 'index.html')
    this.generateHandlebars('index', context, out)
  }

  // TODO: Implement groupby handlebars helper to group by category/tag when implemented.

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

  // TODO: Create a copy method for single files.
  public copyAssets() {
    return this.copyFolder('public', this.config.outDir)
  }

  private async copyFolder(src: string, out: string) {
    await fs.copy(src, out, {
      recursive: true,
      overwrite: true,
      errorOnExist: false,
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
