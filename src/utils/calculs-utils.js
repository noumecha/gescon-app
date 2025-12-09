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

/**
 * Restitue `restoredDays` au personnel en :
 *  1) réduisant la dette existante (si any)
 *  2) puis en réaugmentant le solde normal, sans dépasser le quota annuel
 *
 * @param {Object} person - objet personnel avec au moins:
 *    id_type_personnel (1 or 2), nb_jours_conges (number), dette_conge (number)
 * @param {number} restoredDays - nombre de jours à restituer
 * @returns {{ nb_jours_conges: number, dette_conge: number }}
 */
function restoreDays(person, restoredDays) {
    const entitlement = person.id_type_personnel === 1 ? 30 : 18;
    // Defensive parsing
    let nb = Number.parseInt(person.nb_jours_conges || 0, 10);
    let debt = Number.parseInt(person.dette_conge || 0, 10);
    let rest = Number.parseInt(restoredDays || 0, 10);
    // Type 1 cannot have debt: ensure it's zero
    if (person.id_type_personnel === 1) {
        debt = 0;
    }
    if (rest <= 0) {
        return { nb_jours_conges: nb, dette_conge: debt };
    }
    // 1) D'abord réduire la dette existante (si la personne est de type 2)
    if (debt > 0) {
        const reduceDebt = Math.min(rest, debt);
        debt -= reduceDebt;
        rest -= reduceDebt;
    }
    // 2) Puis ajouter au solde normal sans dépasser l'entitlement annuel
    if (rest > 0) {
        const canAddToNb = Math.max(0, entitlement - nb); // combien on peut encore remettre sans dépasser le quota
        const addToNb = Math.min(rest, canAddToNb);
        nb += addToNb;
        rest -= addToNb;
    }
    // Tout reste non appliqué (rest > 0) est volontairement ignoré :
    // on ne crée pas de "compte négatif" ni on n'augmente la dette automatiquement.
    // Si tu veux au lieu de l'ignorer le convertir en dette, on peut l'activer facilement.
    return { nb_jours_conges: nb, dette_conge: debt };
}


function getCongeTypeId(selectedType) {
    if (!selectedType) return 0;

    const value = selectedType.value || selectedType?.libelle_type_conge || selectedType;

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
    const typeValue = selectedType?.value || selectedType?.libelle_type_conge;

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