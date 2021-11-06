import { VFile } from 'vfile'
import { toVFile, write, read } from 'to-vfile'
import { mkdirp } from 'vfile-mkdirp'
import { rename } from 'vfile-rename'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import LayoutsCache from '@/gen/layouts-cache.js'
import globFiles from '@/gen/glob-files.js'
import HiroConfig from '@/config/hiro-config'
import { join, parse } from 'path'

export default class Generator {
  private readonly config: HiroConfig
  private readonly layouts: LayoutsCache

  constructor(config: HiroConfig) {
    this.config = config
    this.layouts = new LayoutsCache('layouts')
  }

  public async generateAll() {
    for (const src of await globFiles('content/**/*.md')) {
      console.log(src)
      const out = this.getOutPath(src)
      console.log(out)
      await this.generateMarkdown(src, out)
    }
  }

  private getOutPath(src: string) {
    const { dir, name } = parse(src)
    return join(this.config.outDir, dir, `${name}.html`)
  }

  public async generateMarkdown(src: string, out: string) {
    // Hier eine Idee zu einem Plugin fürs moven.
    // https://github.com/unifiedjs/unified #move
    const input = await read(src)
    const output = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      // .use(rehypeRaw)
      // .use(rehypeStringify)
      .process(input)

    // https://github.com/vfile/vfile-reporter-pretty
    console.error(reporter(output))

    const context = { content: String(output) }
    console.log(context)

    // TODO: set article from matter data.
    this.generateHandlebars('article', context, out)
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
