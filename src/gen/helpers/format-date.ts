import handlebars from 'handlebars'
import * as dateFns from 'date-fns'

/**
 * Reasonably smart date formatting routine. Will either format the date up
 * until '|' if the current year equals the date's year, or the entire format
 * without '|' if not. Example:
 *
 *    {{formatDate date "MMM d|',' yyyy"}}
 *
 * If date is the same year as the current date, the format will be
 *
 *    "MMM d"           // i.e. Oct 24
 *
 * and if the date is in any other year, the format will be
 *
 *    "MMM d',' yyyy"   // i.e. Oct 24, 2020
 */
export default function registerFormatDate() {
  handlebars.registerHelper('formatDate', formatDate)
}

export function formatDate(date: Date, fmt: string) {
  const d = new Date(date)
  const parts = fmt.split('|')

  if (parts.length === 1) {
    return dateFns.format(d, parts[0]!)
  }
  if (parts.length === 2) {
    if (d.getFullYear() === new Date().getFullYear()) {
      return dateFns.format(d, parts[0]!)
    }
    return dateFns.format(d, parts[0]! + parts[1]!)
  }
  return '???'
}
