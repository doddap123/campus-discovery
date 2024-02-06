import {EventModel} from "../db/model/Event";

class FormatDate {
    private static dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long', month: 'long', day: 'numeric'
    };
    private static timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit', minute: '2-digit'
    };
    static short = ({startTime: start, endTime: end}: EventModel) =>
        `${
            start.toLocaleTimeString(undefined, FormatDate.timeOptions)
        } - ${
            end.toLocaleTimeString(undefined, FormatDate.timeOptions)
        }`;
    static long = ({startTime: start, endTime: end}: EventModel) => {
        const needsSecondDate = start.getDate() != end.getDate()
            || start.getMonth() != end.getMonth()
            || start.getFullYear() != end.getFullYear();

        return `${start.toLocaleDateString(undefined, FormatDate.dateOptions)} `
        + `${start.toLocaleTimeString(undefined, FormatDate.timeOptions)} - `
        + needsSecondDate ? end.toLocaleDateString(undefined, FormatDate.dateOptions) + ' ' : ''
            + end.toLocaleTimeString(undefined, FormatDate.timeOptions);
    }
}

export default FormatDate;
