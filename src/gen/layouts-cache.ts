import fs from 'fs-extra'
import { join } from 'path'
import handlebars from 'handlebars'
import registerArray from '@/gen/helpers/array.js'
import registerFormatDate from '@/gen/helpers/format-date.js'
import registerOrderBy from '@/gen/helpers/order-by.js'

export default class LayoutsCache {
  private readonly root: string
  private readonly layouts: LayoutsMap

  /**
   * Creates a new layouts cache.
   *
   * @param root Path to the layouts root directoy.
   */
  constructor(root: string) {
    this.root = root
    this.layouts = new LayoutsMap()
    // Register custom handlebars helpers here.
    registerArray()
    registerFormatDate()
    registerOrderBy()
  }

  /**
   * Loads, caches and returns the requested layout. The layout name is
   * equivalent to the filename including any subdirectories without file
   * extension.
   * For instance assume the following layouts directory structure:
   *
   *   layouts
   *    + foo
   *       + layout2.handlebars
   *    + layout1.handlebars
   *
   * The correct layout names would then be 'layout1' and 'foo/layout2'.
   *
   * @param name The layout identifer.
   */
  public async findLayout(name: string) {
    if (this.layouts.has(name) === false) {
      const layout = await this.loadLayout(name)
      this.layouts.set(name, layout)
    }
    return this.layouts.get(name)!
  }

  private async loadLayout(name: string) {
    const path = join(this.root, `${name}.handlebars`)
    const source = await fs.readFile(path, 'utf8')
    return handlebars.compile(source)
  }

  public clear() {
    this.layouts.clear()
  }
}

class LayoutsMap extends Map<string, HandlebarsTemplateDelegate<any>> {}
