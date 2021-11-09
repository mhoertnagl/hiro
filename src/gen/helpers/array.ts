import handlebars from 'handlebars'

export default function registerArray() {
  handlebars.registerHelper('array', array)
}

export function array(...args: any) {
  return args
}
