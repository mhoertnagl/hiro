import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import type { Options } from 'mdast-util-from-markdown'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'

export default function frontMatter(): Plugin<
  [Options?] | void[],
  string,
  Root
> {
  return (tree: any, file: VFile) => {
    matter(file, { strip: true })
  }
}
