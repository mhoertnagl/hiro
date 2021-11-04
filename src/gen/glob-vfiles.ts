import glob from 'fast-glob'
import { toVFile } from 'to-vfile'

export default function globVFiles(pattern: string, cwd?: string) {
  return glob(pattern, { cwd: cwd, onlyFiles: true }).then((fps) =>
    fps.map(toVFile)
  )
}
