import { VFile } from 'vfile'
import { ReadTimeResults } from 'reading-time'

import { ext } from '@/utils/file-paths.js'

export default class PageContexts {
  private readonly pages: PageContext[]

  /**
   *
   */
  constructor() {
    this.pages = []
  }

  public get() {
    return this.pages
  }

  public set(src: string, output: VFile) {
    return this.setContext({
      path: ext(src, '.html'),
      matter: output.data.matter as Frontmatter,
      readTime: output.data.readTime as ReadTimeResults,
      content: String(output),
    })
  }

  private setContext(context: PageContext) {
    const existing = this.pages.find((c) => c.path === context.path)
    if (existing) {
      Object.assign(existing, context)
    } else {
      this.pages.push(context)
    }
    return context
  }
}

interface PageContext {
  path: string
  matter: Frontmatter
  readTime: ReadTimeResults
  content: string
}

interface Frontmatter {
  layout: string
  title: string
  synopsis: string
  date: Date
}
