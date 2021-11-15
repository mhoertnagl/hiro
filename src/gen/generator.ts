import fs from 'fs-extra'
import { join } from 'path'
import { VFile } from 'vfile'
import { toVFile, write, read } from 'to-vfile'
import { mkdirp } from 'vfile-mkdirp'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

import HiroConfig from '@/config/hiro-config.js'
import LayoutsCache from '@/gen/layouts-cache.js'
import PageContexts from '@/gen/page-contexts.js'
import globFiles from '@/gen/glob-files.js'
import { matter } from 'vfile-matter'
import readingTime from '@/gen/plugins/reading-time.js'
import { ext, superdir } from '@/utils/file-paths.js'

export default class Generator {
  private readonly config: HiroConfig
  private readonly layouts: LayoutsCache
  private readonly pages: PageContexts

  constructor(config: HiroConfig) {
    this.config = config
    this.layouts = new LayoutsCache('layouts')
    this.pages = new PageContexts()
  }

  public async generateAll() {
    await this.generateAllContent()
    await this.generateIndex()
    await this.copyAssets()
  }

  public async generateAllContent() {
    // Clear the layouts cache. Some layouts may not be up-to-date anymore.
    this.layouts.clear()
    for (const src of await globFiles('content/**/*.md')) {
      await this.generateContent(src)
    }
  }

  public generateContent(src: string) {
    // Place the generated contents nto the output directory but preserve the
    // subdirectories. The output file is an HTML file.
    const out = superdir(ext(src, '.html'), this.config.outDir)
    // console.log(src + ' -> ' + out)
    return this.generateMarkdown(src, out)
  }

  // TODO: Comments plugin.
  // TODO: Hints, Warnings plugin.
  private async generateMarkdown(src: string, out: string) {
    const input = await read(src)
    const output = await this.processMarkdown(input)
    const context = this.pages.set(src, output)
    console.error(reporter(output))
    this.generateHandlebars(context.matter.layout, context, out)
  }

  /**
   * Applies the remark and rehype pipeline to the loaded input vfile.
   *
   * @param input The input vfile with content loaded.
   * @returns The processed markdown contents as a vfile.
   */
  private processMarkdown(input: VFile) {
    return unified()
      .use(readingTime)
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(matter(input, { strip: true }))
  }

  /**
   * Generates the index html file.
   */
  public async generateIndex() {
    // The context for the index templates contains all meta-data for all
    // generated content pages. These contain the relative path to the content
    // page, the front matter, reading time and the rendered contents.
    const context = { pages: this.pages.get() }
    const out = join(this.config.outDir, 'index.html')
    this.generateHandlebars('index', context, out)
  }

  // TODO: Implement groupby handlebars helper to group by category/tag when implemented.

  /**
   * Locates the layout, compiles it with the provided context and stores the
   * rendered contents to the out file. Non-existing directories will be
   * created automatically beforehand.
   *
   * @param layout The layout identifer.
   * @param context The render context.
   * @param out The path to the output file.
   */
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
  /**
   * Copies all static assets from the public directory to the output root
   * directory.
   */
  public copyAssets() {
    return this.copyDirectory('public', this.config.outDir)
  }

  /**
   * Copies the contents of the source directory to the destination directory.
   *
   * @param src The source directory.
   * @param out The destination directory.
   */
  private async copyDirectory(src: string, out: string) {
    await fs.copy(src, out, {
      recursive: true,
      overwrite: true,
      errorOnExist: false,
    })
  }
}
