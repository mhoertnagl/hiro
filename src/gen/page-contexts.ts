import { VFile } from 'vfile'
import { ReadTimeResults } from 'reading-time'

import { ext } from '@/utils/file-paths.js'

/**
 * Manages the list of page contexts. Each generated file will have such a
 * context registered. The list of these contexts is then available for
 * processing in the index template.
 */
export default class PageContexts {
  private readonly pages: PageContext[]

  /**
   * Creates a new page contexts cache.
   */
  constructor() {
    this.pages = []
  }

  /**
   * Returns the contexts of pages that are ready to be published.
   *
   * @returns The list of page contexts.
   */
  public get() {
    return this.pages.filter((p) => p.matter.draft !== true)
  }

  /**
   * Creates or updates the context for a page.
   *
   * @param src The path to the source file.
   * @param output The VFile.
   * @returns The current page context.
   */
  public set(src: string, output: VFile) {
    return this.setContext({
      path: ext(src, '.html'),
      matter: output.data.matter as Frontmatter,
      readTime: output.data.readTime as ReadTimeResults,
      content: String(output),
    })
  }

  /**
   * Creates or updates the context for a page.
   *
   * @param context The context to be created or updated.
   * @returns The same page context.
   */
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

/**
 * Meta information for a page.
 */
interface PageContext {
  path: string
  matter: Frontmatter
  readTime: ReadTimeResults
  content: string
}

/**
 * Front matter information for a page.
 */
interface Frontmatter {
  layout: string
  title: string
  synopsis: string
  date: Date
  draft?: boolean
}
