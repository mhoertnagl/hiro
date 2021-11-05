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
import globVFiles from '@/gen/glob-vfiles.js'
import HiroConfig from '@/config/hiro-config'
import { join } from 'path'

export default class Generator {
  private readonly config: HiroConfig
  private readonly layouts: LayoutsCache

  constructor(config: HiroConfig) {
    this.config = config
    this.layouts = new LayoutsCache('layouts')
  }

  public async generateAll() {
    for (const src of await globVFiles('content/**/*.md')) {
      console.log(src)
      // console.log(src.basename)
      // console.log(src.dirname)
      // console.log(src.extname)
      // console.log(src.path)
      // console.log(src.stem)
      const out = this.getOutPath(src)
      console.log(src)
      await this.generateMarkdown(src, out)
    }
  }

  private getOutPath(src: VFile) {
    return rename(toVFile(src), [
      { dirname: { prefix: this.config.outDir } },
      '.html',
    ])
  }

  public async generateMarkdown(src: VFile, out: VFile) {
    // Hier eine Idee zu einem Plugin fürs moven.
    // https://github.com/unifiedjs/unified #move
    const output = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      // .use(rehypeRaw)
      // .use(rehypeStringify)
      .process(await read(src))

    // https://github.com/vfile/vfile-reporter-pretty
    console.error(reporter(output))

    const context = { content: String(output) }
    console.log(context)

    // TODO: set article from matter data.
    this.generateHandlebars('article', context, out)
  }

  public async generateHandlebars(layout: string, context: object, out: VFile) {
    const compile = await this.layouts.findLayout(layout)
    out.value = compile(context)
    await mkdirp(out)
    await write(out)
  }

  // public async generateMarkdown(src: string, out: string) {
  //   const input = toVFile(src)
  //   const output = await unified()
  //     .use(remarkParse)
  //     .use(remarkGfm)
  //     .use(remarkRehype, { allowDangerousHtml: true })
  //     .use(rehypeStringify, { allowDangerousHtml: true })
  //     // .use(rehypeRaw)
  //     // .use(rehypeStringify)
  //     .process(input)

  //   console.error(reporter(output))

  //   const context = { content: output.value }

  //   // TODO: set article from matter data.
  //   this.generateHandlebars('article', context, out)
  // }

  // public async generateHandlebars(
  //   layout: string,
  //   context: object,
  //   out: string
  // ) {
  //   const compile = await this.layouts.findLayout(layout)
  //   const html = compile(context)
  //   const file = new VFile({ path: out, value: html })
  //   await mkdirp(file)
  //   await write(file)
  // }
}
