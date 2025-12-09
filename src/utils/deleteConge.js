import { leftDays, restoreDays } from "./calculs-utils";
import { formatDate } from "./dates-utils";
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
        let req_personnel = "";
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
        // req personnel
        if (person.nb_jours_conges === parseInt(0)) {
            req_personnel = `UPDATE personnel SET dette_conge = (dette_conge + ${parseInt(conge.attestation_conge.duree_conge)}),
            statut_personnel = 'en poste' WHERE id_personnel = ${conge.id_personnel};`;
        } else {
            req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges + ${parseInt(left_days)}),
            statut_personnel = 'en poste' WHERE id_personnel = ${conge.id_personnel};`;
        }
        let req_conge = `UPDATE conge SET  statut_conge = "annulé" WHERE id_conge = ${conge.id_conge} AND id_personnel = ${conge.id_personnel};`;
        let today = formatDate(new Date());
        let start = formatDate(conge.date_debut_conge);
        let end = formatDate(conge.date_fin_conge);
        // nombre de jours à restituer dans chaque cas
        if (start > today) {
            // annulation avant début : restituer toute la durée demandée
            const restored = parseInt(conge.attestation_conge.duree_conge, 10);
            const { nb_jours_conges, dette_conge } = restoreDays(person, restored);

            req_conge = `
                DELETE FROM conge
                WHERE id_conge = ${conge.id_conge} AND id_personnel = ${conge.id_personnel};
            `;

            req_personnel = `
                UPDATE personnel SET
                nb_jours_conges = (nb_jours_conges + ${nb_jours_conges}),
                dette_conge = ${dette_conge},
                statut_personnel = 'en poste'
                WHERE id_personnel = ${conge.id_personnel};
            `;
        }
        else if (today >= start && today <= end) {
            // annulation en cours : restituer les jours restants (left_days)
            const restored = parseInt(left_days, 10);
            const { nb_jours_conges, dette_conge } = restoreDays(person, restored);

            req_conge = `
                UPDATE conge
                SET statut_conge = "annulé"
                WHERE id_conge = ${conge.id_conge} AND id_personnel = ${conge.id_personnel};
            `;

            req_personnel = `
                UPDATE personnel SET
                nb_jours_conges = (nb_jours_conges + ${nb_jours_conges}),
                dette_conge = ${dette_conge},
                statut_personnel = 'en poste'
                WHERE id_personnel = ${conge.id_personnel};
            `;
        }
        console.log("req_conge update : ", req_conge);
        console.log("req_personnel update : ", req_personnel);
        // send request and getting response
        window.electronAPI.addConge(req_conge);
        window.electronAPI.updatePersonnel(req_personnel);
        window.electronAPI.congeAddedSuccess(() => {
            setSuccess("congé supprimer/annuler avec succès");
            setStatus(`Le satut de ${formatPersonnelName(person.sexe_personnel, person.nom_prenom_personnel)} a été mis à jour !`);
        });
        setTimeout(() => {
            setSuccess("");
        }, 3000);
    } catch (error) {
        setError("Error when deleting conge : ", error);
        setTimeout(() => {
            setError("");
        }, 5000)
        console.log("Error when deleting conge : ", error);
    }
}

export { deleteConge }