export function ensurePrefix(value, prefix) {
    return value?.startsWith(prefix) ? value : prefix + value;
}
export function ensurePostfix(value, postfix) {
    return value?.endsWith(postfix) ? value : value + postfix;
}
