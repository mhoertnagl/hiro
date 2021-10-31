import { join, parse } from 'path'
import { ensurePrefix } from './strings'

export function ext(path: string, ext: string) {
  const { dir, name } = parse(path)
  return join(dir, name + ensurePrefix(ext, '.'))
}

export function name(path: string, name: string) {
  const { dir, ext } = parse(path)
  return join(dir, name + ext)
}

export function dir(path: string, ...dirs: string[]) {
  const { name, ext } = parse(path)
  return join(...dirs, name + ext)
}

export function subdir(path: string, ...subdirs: string[]) {
  const { dir, name, ext } = parse(path)
  return join(dir, ...subdirs, name + ext)
}
