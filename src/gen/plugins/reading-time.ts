import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import type { Options } from 'mdast-util-from-markdown'
import { VFile } from 'vfile'
import computeReadingTime from 'reading-time'

export default function readingTime(): Plugin<
  [Options?] | void[],
  string,
  Root
> {
  return (tree: any, file: VFile) => {
    file.data.readTime = computeReadingTime(String(file))
  }
}
