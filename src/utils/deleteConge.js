import { leftDays } from "./calculs-utils";
import { getPerson } from "./getPerson";
import { formatPersonnelName } from "./personnels-utils";
/**
 * function to delete a conge
 * @param {Object} conge - The conge object to be deleted
 */
const deleteConge = async (conge, setSuccess, setError, setStatus) => {
    try {
        const left_days = leftDays(conge.date_debut_conge, conge.date_fin_conge, conge.attestation_conge)
        const person = await getPerson(conge.id_personnel); 
        //console.log("requires datas => " + "left days : " + left_days + " | person : " + JSON.stringify(person));
        const req_conge = `UPDATE conge SET  statut_conge = "annulé" WHERE id_conge = ${conge.id_conge} AND id_personnel = ${conge.id_personnel};`;
        //console.log(req_conge);
        let req_personnel;
        switch (conge.libelle_type_conge) {
            case 'congé maternité':
            case 'congé paternité':
                req_personnel = `UPDATE personnel SET nb_jours_conges_maternite = (nb_jours_conges_maternite + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel}`;
                break;
            case 'congé maladie':
                req_personnel = `UPDATE personnel SET nb_jours_conges_maladie = (nb_jours_conges_maladie + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel}`;
                break;
            case 'congé mariage':
                req_personnel = `UPDATE personnel SET nb_jours_conges_mariage	= (nb_jours_conges_mariage + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel}`;
                break;
            case 'congé décès':
                req_personnel = `UPDATE personnel SET nb_jours_conges_deces = (nb_jours_conges_deces + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel}`;
                break;
            default:
                req_personnel = '';
                break;
        }
        if (person.nb_jours_conges === parseInt(0)) {
            req_personnel = `UPDATE personnel SET dette_conge = (dette_conge + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel};`;
        } else {         
            req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges + ${parseInt(left_days)}) WHERE id_personnel = ${conge.id_personnel};`;
        }
        // send request and getting response
        window.electronAPI.addConge(req_conge);
        window.electronAPI.updatePersonnel(req_personnel);
        window.electronAPI.congeAddedSuccess(() => { 
            setSuccess("congé supprimer/annuler avec succès");
            setStatus(`Le satut de ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a été mis à jour !`);
        });
        setTimeout(() => {
            setSuccess("");
        }, 3000)
    } catch (error) {
        setError("Error when deleting conge : ", error);
        setTimeout(() => {
            setError("");
        }, 5000)
        console.log("Error when deleting conge : ", error);
    }
}

export { deleteConge }