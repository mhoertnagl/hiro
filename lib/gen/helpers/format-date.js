import handlebars from "handlebars";
import * as dateFns from "date-fns";
export default function registerFormatDate() {
    handlebars.registerHelper("formatDate", (date, fmt) => {
        const d = new Date(date);
        const parts = fmt.split("|");
        if (parts.length === 1) {
            return dateFns.format(d, parts[0]);
        }
        if (parts.length === 2) {
            if (d.getFullYear() === new Date().getFullYear()) {
                return dateFns.format(d, parts[0]);
            }
            return dateFns.format(d, parts[0] + parts[1]);
        }
        return "???";
    });
}
