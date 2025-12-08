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

function restoreDays(person, restored_days) {
    let { nb_jours_conges, dette_conge } = person;
    // 1. Restituer à la dette d'abord
    const restoreToDebt = Math.min(restored_days, person.initial_dette_used || dette_conge);
    dette_conge += restoreToDebt;
    // 2. Puis au solde normal
    const remaining = restored_days - restoreToDebt;
    nb_jours_conges += remaining;
    return { nb_jours_conges, dette_conge };
}

function getCongeTypeId(selectedType) {
    if (!selectedType) return 0;

    const value = selectedType.value || selectedType;

    const typeMap = {
        "congé administratif": 1,
        "congé maternité": 3,
        "congé paternité": 3,
        "congé maladie": 4,
        "congé mariage": 7,
        "congé décès": 8,
    };

    return typeMap[value] || 0;
}

function calculateCongeAdmin(selectedType, duration, selectedPerson, total_conge_admin) {
    // Extract value safely
    const typeValue = selectedType?.value;

    // Return current if not "congé administratif"
    if (typeValue !== "congé administratif") {
        return total_conge_admin + 1;
    }

    // Personnel type rules
    const limits = {
        1: 30, // type personnel 1 → limit 30
        2: 18  // type personnel 2 → limit 18
    };

    const requiredDuration = limits[selectedPerson?.id_type_personnel];

    // Matches the condition → return 0
    if (duration === requiredDuration) {
        return 0;
    }

    // Otherwise increment
    return total_conge_admin + 1;
}

function getCongeStatus(curr_date, startDate, endDate) {
    // Format once
    const current = curr_date.toISOString().slice(0, 19).replace('T', ' ');
    if (current >= startDate && current <= endDate) {
        return "en cours";
    }
    if (current >= endDate) {
        return "terminé";
    }
    return "programmé";
}

function getEmployeeSituation(curr_date, startDate, endDate) {
    // Format current date one time
    const current = curr_date.toISOString().slice(0, 19).replace('T', ' ');
    return (current >= startDate && current <= endDate)
        ? "en congé"
        : "en poste";
}

function calculateRemainingDays(selectedPerson, duration) {
    const baseDays = parseInt(selectedPerson.nb_jours_conges);
    if (selectedPerson.id_type_personnel === 1) {
        return baseDays;
    }
    return parseInt(baseDays + selectedPerson.dette_conge - duration);
}


export { leftDays , calculateCongeAdmin, getCongeTypeId, restoreDays, getCongeStatus, getEmployeeSituation, calculateRemainingDays };