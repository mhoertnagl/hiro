import { join, parse } from 'path';
import { ensurePrefix } from '../utils/strings.js';
export function normalize(path) {
    return path.endsWith('/') || path.endsWith('\\') ? path : path + '/';
}
export function ext(path, ext) {
    const { dir, name } = parse(path);
    return join(dir, name + ensurePrefix(ext, '.'));
}
export function superdir(path, ...superdirs) {
    const { dir, name, ext } = parse(path);
    return join(...superdirs, dir, name + ext);
}
