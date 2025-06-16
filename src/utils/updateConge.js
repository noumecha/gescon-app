import { formatDate } from "./dates-utils";
import { nbDaysBetween, formatDateDayForm, formatDateMonthForm } from "./dates-utils";
import { personConge } from "./personConges";
import { formatPersonnelName } from "./personnels-utils";
import { validateDuration } from "./validateDuration";

const updateConge = async (
    congeToEdit, duration, setError, startDate, typeConge, personnel, setSuccess, endDate, repriseDate, setStatus, demande, document, setDuration
) => {
    try {
        let total_conge_admin = 0;
        let nbDaysConges = 0;
        const person = personnel[0];
        const type = typeConge[0];
        const curr_date = new Date();
        const userConge = personConge(person.id_personnel);
        const old_duration = congeToEdit.duration;
        const left_duration = person.id_type_personnel === 2 ? person.nb_jours_conges + person.dette_conge : person.nb_jours_conges;
        // check if the duration is valid
        if (!validateDuration(duration, setError)) return;
        if (person.id_type_personnel === 2) {
            if ((duration > old_duration + person.nb_jours_conges + person.dette_conge) && (formatDate(startDate).getFullYear() === curr_date.getFullYear()) 
                && (type.libelle_type_conge === "congé administratif")) {
              setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles pour cette année");      
                setTimeout(() => {
                setError("");
                },7000)
              return;
            }
            if ((duration > old_duration + person.nb_jours_conges + person.dette_conge) && (type.libelle_type_conge === "congé administratif")) {
              setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles");      
                setTimeout(() => {
                setError("");
                },7000)
              return;
            }
            // taking conge before the current year : 
            if ((curr_date.getFullYear() - formatDate(startDate).getFullYear()) > 3) {
              setError(`Impossible de configurer un congé pour plus de 3 ans en arrière !`);      
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
            if (duration > old_duration + person.nb_jours_conges && (type.libelle_type_conge === "congé administratif")) {
                setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
        }
        // get all administrative conge 
        if (userConge && userConge.length > 0) {
            for (let index = 0; index < userConge.length; index++) {
            if (userConge[index].attestation_conge.typeConge === "congé administratif") {
                total_conge_admin += 1;
            }
            }
        }
        // controls about total_conge_admin 
        if (duration < old_duration + person.nb_jours_conges + person.dette_conge && total_conge_admin === 2 && congeToEdit.libelle_type_conge === "congé administratif" ) {
            setDuration(old_duration + person.nb_jours_conges + person.dette_conge);
            setError(`Ce congé constitue la 3ème partie du congé administratif de ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} 
                donc la durée doit être égale au nombre de jours restants`);
            setTimeout(() => {
            setError("");
            },7000)
            return;
        }
        // // remove taking leave for the next-year
        if (formatDate(startDate).getFullYear() > curr_date.getFullYear()) {
            setError(`Impossible de définir un congé pour une année ultérieure`);
            return;
        }
        // taking lasts leaves date for blocking the same dates
        if (userConge.length > 0) {
            for (let index = 0; index < userConge.length; index++) {
                let csd = formatDate(startDate).getDate() + '/' + formatDateMonthForm(startDate) + '/' + formatDate(startDate).getFullYear();
                nbDaysConges += nbDaysBetween(formatDate(userConge[index].date_debut_conge),formatDate(userConge[index].date_fin_conge)) + 1;
                if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
                    //console.log(`1`);
                    setError(`Impossible de configurer le congé pour cette date car ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a déja un congé prévu`);
                    return;
                }
                if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) || (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
                    //console.log(`2`);  
                    setError(`Impossible de configurer le congé pour cette date car ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a déja pris un congé`);
                    return;
                }
                if (formatDate(startDate) === formatDate(userConge[index].attestation_conge.date_debut_conge)) {
                    //console.log(`3`);
                    setError(`Impossible de configurer le congé pour cette date car ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a un congé prévu cette meme date`);
                    return;
                }
                if (formatDate(startDate) === formatDate(userConge[index].date_debut_conge)) {
                    //console.log(`3`);
                    setError(`Impossible de configurer le congé pour cette date car ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a un congé prévu cette meme date`);
                    return;
                }
                if (JSON.stringify(userConge[index].attestation_conge.repriseDate) === JSON.stringify(csd)) {
                    setError(`Impossible de configurer le congé pour cette date car la date de debut coïncide avec une date de reprise de service`);
                    return;
                }
                setTimeout(() => {
                    setError("");
                },7000)
            }
        }
        // get all administrative conge 
        if (userConge.length > 0) {
            for (let index = 0; index < userConge.length; index++) {
                if (userConge[index].attestation_conge.typeConge === "congé administratif") {
                    total_conge_admin += 1;
                }
            }
        }
        //console.log(congeToEdit.attestation_conge);
        // leave attestation datas
        const attestation = {
            numero_conge_admin : (congeToEdit.libelle_type_conge === "congé administratif" && duration === 18 + person.dette_conge && person.id_type_personnel === 2) 
            || (congeToEdit.libelle_type_conge === "congé administratif" && duration === 30 && person.id_type_personnel === 1) 
            ? 0 : total_conge_admin += 1,
            name: person.nom_prenom_personnel.replace(/'/g, "''"),
            matricule: congeToEdit.attestation_conge.matricule,
            sexe: person.sexe_personnel,
            poste: person.poste_personnel.replace(/'/g, "''"),
            type: person.id_type_personnel === 2 ? "contractuelle" : "fonctionnaire",
            decision: congeToEdit.attestation_conge.decision,
            duration: duration,
            structure: person.structure_personnel.replace(/'/g, "''"),
            nb_jour_conges_restant : person.id_type_personnel === 1 ? parseInt(person.nb_jours_conges) : parseInt(person.nb_jours_conges + person.dette_conge - duration),
            startDate: formatDateDayForm(startDate) + "/" + formatDateMonthForm(startDate) +"/"+formatDate(startDate).getFullYear(),
            endDate: formatDateDayForm(endDate) + "/" + formatDateMonthForm(endDate) + "/"+formatDate(endDate).getFullYear(),
            repriseDate: formatDateDayForm(repriseDate) + "/" + formatDateMonthForm(repriseDate) + "/" + formatDate(repriseDate).getFullYear(),
            typeConge: congeToEdit.attestation_conge.typeConge,
            preposition: person.preposition_personnel,
            grade : person.grade_personnel.replace(/'/g, "''"),
            created_at : new Date().toISOString().slice(0,19).replace('T',' '),
            // need to adding qr_code
        }
        // datas for the leave
        const conge_data = {
            numero_conge_admin : (congeToEdit.libelle_type_conge === "congé administratif" && duration === 18 && person.id_type_personnel === 2) 
            || (congeToEdit.libelle_type_conge === "congé administratif" && duration === 30 && person.id_type_personnel === 1) 
            ? 0 : total_conge_admin += 1,
            startDate : startDate,
            endDate : endDate,
            duration : duration,
            id_personnel: person.id_personnel,
            curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
            demande : demande,
            document : document,
            id_type_conge : congeToEdit.libelle_type_conge === "congé administratif" ? 1 : congeToEdit.libelle_type_conge === "congé maternité" || congeToEdit.libelle_type_conge === "congé paternité" ? 3 : congeToEdit.libelle_type_conge === "congé maladie" ? 4 : congeToEdit.libelle_type_conge === "congé mariage" ? 7 : congeToEdit.libelle_type_conge === "congé décès" ? 8 : 0,
            statut_attestation_conge : "non archivé",
            statut_conge : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en cours" : curr_date.toISOString().slice(0,19).replace('T',' ') >= endDate ? "terminé" : "programmé",
            statut_personnel : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en congé" : "en poste",
        }
        // query for saving leaves
        const req_conge = `UPDATE conge 
                SET date_debut_conge = "${conge_data.startDate}",
                date_fin_conge = "${conge_data.endDate}",
                duree_conge = ${conge_data.duration},
                created_at_conge = "${conge_data.curr_date}",
                attestation_conge = '${JSON.stringify(attestation)}',
                statut_conge = "${conge_data.statut_conge}",
                statut_attestation_conge = "${conge_data.statut_attestation_conge}"
            WHERE id_conge = ${congeToEdit.id_conge} AND id_personnel = ${person.id_personnel}
            ;`;
        console.log(req_conge);
        let req_personnel;
        switch (congeToEdit.libelle_type_conge) {
            case 'congé maternité':
            case 'congé paternité':
                req_personnel = `UPDATE personnel SET nb_jours_conges_maternite = (nb_jours_conges_maternite + ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel}`;
                break;
            case 'congé maladie':
                req_personnel = `UPDATE personnel SET nb_jours_conges_maladie = (nb_jours_conges_maladie + ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel}`;
                break;
            case 'congé mariage':
                req_personnel = `UPDATE personnel SET nb_jours_conges_mariage	= (nb_jours_conges_mariage + ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel}`;
                break;
            case 'congé décès':
                req_personnel = `UPDATE personnel SET nb_jours_conges_deces = (nb_jours_conges_deces - ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel}`;
                break;
            default:
                req_personnel = '';
                break;
        }
        if (person.nb_jours_conges === parseInt(0)) {
            req_personnel = `UPDATE personnel SET dette_conge = (dette_conge - ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel};`;
        } else {
            let diff_dette_conge;
            if (duration > old_duration) {
                diff_dette_conge = duration - old_duration + person.nb_jours_conges;
            } else {
                diff_dette_conge = old_duration - duration + person.nb_jours_conges;
            }         
            req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges - ${parseInt(person.nb_jours_conges)}), dette_conge = (dette_conge - ${parseInt(diff_dette_conge)} ) WHERE id_personnel = ${conge_data.id_personnel};`;
        }
        // saving leaves
        window.electronAPI.addConge(req_conge);
        window.electronAPI.updatePersonnel(req_personnel);
        window.electronAPI.congeAddedSuccess(() => { 
            setSuccess("congé mis à jour avec succès");
            setStatus(`Le satut de ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a été mis à jour !`);
        });
        setTimeout(() => {
            setSuccess("");
        }, 3000)
    } catch (error) {
        console.error("Error updating conge:", error);
        setError("Erreur lors de la mise à jour du congé : " + error.message);
        setTimeout(() => {
            setError("");
        }, 7000);
    }
}

export { updateConge }