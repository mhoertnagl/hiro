export function ensurePrefix(value: string, prefix: string) {
  return value?.startsWith(prefix) ? value : prefix + value
}

export function ensurePostfix(value: string, postfix: string) {
  return value?.endsWith(postfix) ? value : value + postfix
}
