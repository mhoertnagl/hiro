import glob from 'fast-glob'

export default function globFiles(pattern: string, cwd?: string) {
  return glob(pattern, { cwd: cwd, onlyFiles: true })
}
