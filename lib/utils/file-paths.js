export function normalize(path) {
    return path.endsWith('/') || path.endsWith('\\') ? path : path + '/';
}
