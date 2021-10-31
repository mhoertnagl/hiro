import { join, parse } from 'path';
import { ensurePrefix } from './strings';
export function ext(path, ext) {
    const { dir, name } = parse(path);
    return join(dir, name + ensurePrefix(ext, '.'));
}
export function name(path, name) {
    const { dir, ext } = parse(path);
    return join(dir, name + ext);
}
export function dir(path, ...dirs) {
    const { name, ext } = parse(path);
    return join(...dirs, name + ext);
}
export function subdir(path, ...subdirs) {
    const { dir, name, ext } = parse(path);
    return join(dir, ...subdirs, name + ext);
}
export function superdir(path, ...superdirs) {
    const { dir, name, ext } = parse(path);
    return join(...superdirs, dir, name + ext);
}
