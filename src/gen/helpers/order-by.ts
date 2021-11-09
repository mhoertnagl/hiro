import handlebars from 'handlebars'
import lodash from 'lodash'

type order = 'asc' | 'desc'

export default function registerOrderBy() {
  handlebars.registerHelper('orderBy', orderBy)
}

export function orderBy(
  collection: any[],
  iteratees: string | string[],
  orders: order | order[]
) {
  return lodash.orderBy(collection, iteratees, orders)
}
