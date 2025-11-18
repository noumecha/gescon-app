/**
 * determinate the left days between two conges dates
 */
const leftDays = (startDate, endDate, attestation) => {
    let typePersonnel = JSON.stringify(attestation.type)
    const curr_date = new Date();
    if (curr_date >= startDate && curr_date <= endDate) {
        if (typePersonnel === "Contractuelle") {
            let weekdaysToAdd = Math.ceil((endDate - curr_date) / (1000 * 3600 * 24)) - 1;
            while (weekdaysToAdd > 0) {
                endDate.setDate(endDate.getDate() + parseInt(1));
                if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
                    weekdaysToAdd--;
                }
            }
            return Math.ceil((endDate - curr_date) / (1000 * 3600 * 24));
        } else {
            return Math.ceil((endDate - curr_date) / (1000 * 3600 * 24));
        }
    } else {
        if (typePersonnel === "Contractuelle") {
            let weekdaysToAdd = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) - 1;
            while (weekdaysToAdd > 0) {
                startDate.setDate(startDate.getDate() + parseInt(1));
                if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
                    weekdaysToAdd--;
                }
            }
            return Math.ceil((endDate - startDate) / (1000 * 3600 * 24))
        } else {
            return Math.ceil((endDate - startDate) / (1000 * 3600 * 24))
        }
    }
}

export { leftDays }