const firstDateOfMonth = (d) => {
    var date = new Date(d);
    var y = date.getFullYear();
    var m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    return firstDay;
}

const lastDateOfMonth = (d) => {
    var date = new Date(d);
    var y = date.getFullYear();
    var m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    return lastDay;

}

const dateInRange = (d, start, end) => {
    if (d >= start && d <= end) {
        return true;
    } else {
        return false;
    }
}

const formatDate = (d) => {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
}

const monthToText = (n) => {
    switch (n) {
        case 0:
            return 'Janvier';
        case 1:
            return 'Fevrier';
        case 2:
            return "Mars";
        case 3:
            return "Avril";
        case 4:
            return "Mai";
        case 5:
            return "Juin";
        case 6:
            return "Juillet";
        case 7:
            return "Août";
        case 8:
            return "Septembre";
        case 9:
            return "Octobre";
        case 10:
            return "Novembre";
        case 11:
            return "Decembre";
        default:
            break;
    }
}

const nbDaysBetween = (start, end) => {
    return parseInt(Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
}

const formatDateDayForm = (date) => {
    if (formatDate(date).getDate() < 10 ) 
        return "0"+formatDate(date).getDate()
    else 
        return formatDate(date).getDate()
}
const formatDateMonthForm = (date) => {
    if (parseInt(formatDate(date).getMonth()+1) >= 10) 
        return parseInt(formatDate(date).getMonth()+1)
    else 
        return "0"+parseInt(formatDate(date).getMonth()+1)
}
export {dateInRange, formatDate, lastDateOfMonth, firstDateOfMonth, monthToText, nbDaysBetween, formatDateDayForm, formatDateMonthForm}