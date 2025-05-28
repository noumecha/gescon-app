import { formatDate } from "./dates-utils";
import { nbDaysBetween, formatDateDayForm, formatDateMonthForm } from "./dates-utils";
import { formatPersonnelName } from "./personnels-utils";
import { validateDuration } from "./validateDuration";

const updateConge = async (
    duration, setError, startDate, typeConge, personnel, setSuccess
) => {
    try {
        const person = personnel[0];
        const type = typeConge[0];
        const curr_date = new Date();
        if (!validateDuration(duration, setError)) return;
        if (person.id_type_personnel === 2) {
            if ((duration > person.nb_jours_conges + person.dette_conge) && (formatDate(startDate).getFullYear() === curr_date.getFullYear()) 
                && (type.libelle_type_conge === "congé administratif")) {
              setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles pour cette année");      
                setTimeout(() => {
                setError("");
                },7000)
              return;
            }
            if ((duration > person.nb_jours_conges + person.dette_conge) && (type.libelle_type_conge === "congé administratif")) {
              setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles");      
                setTimeout(() => {
                setError("");
                },7000)
              return;
            }
            // taking conge before the current year : 
            if ((curr_date.getFullYear() - formatDate(startDate).getFullYear()) > 3) {
              setError(`Impossible de définir un congé pour plus de 3 ans en arrière !`);      
                setTimeout(() => {
                setError("");
                },7000)
              return;
            }
        }
        // tests for all person
        if (formatDate(startDate).getDay() === 0 || formatDate(startDate).getDay() === 6) {
            setError("Le congé ne peut etre configurer que pour les jours ouvrables");
            setTimeout(() => {
                setError("");
            },7000)
            return;
        }
        if ((person.id_type_personnel === 2 && ((person.nb_jours_conges + person.dette_conge) === 0)) && (type.libelle_type_conge === "congé administratif")) {
            setError(`${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a déja epuisé tout ces congés pour l'année`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
        }
        // tests for administratif person
        if (person.id_type_personnel === 1) {
            console.log(duration, type.libelle_type_conge);
            if (duration > person.nb_jours_conges && (type.libelle_type_conge === "congé administratif")) {
                setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
        }
    } catch (error) {
        console.error("Error updating conge:", error);
        setError("Erreur lors de la mise à jour du congé : " + error.message);
        setTimeout(() => {
            setError("");
        }, 7000);
    }
}

export { updateConge }