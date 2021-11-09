import handlebars from 'handlebars';
import lodash from 'lodash';
export default function registerOrderBy() {
    handlebars.registerHelper('orderBy', orderBy);
}
export function orderBy(collection, iteratees, orders) {
    return lodash.orderBy(collection, iteratees, orders);
}
