import { formatDate } from "./dates-utils";
import { formatDateMonthForm, formatFullDate } from "./dates-utils";
import { formatPersonnelName } from "./personnels-utils";
import { validateDuration } from "./validateDuration";
import { getCongeTypeId, calculateCongeAdmin, getCongeStatus, getEmployeeSituation, calculateRemainingDays } from "./calculs-utils";

const saveConge = async (
  selectedPerson, selectedType, typeConge, name, startDate, endDate, duration, setDuration,
  repriseDate, matricule, type, selectedDec, struc, poste, userConge, lastPermission, setError, sexe, nb_jours_conges,
  setSuccess, setActived, grade, demande, preposition, setStatus, document
) => {
  try {
    let total_conge_admin = 0;
    const curr_date = new Date();
    if (!validateDuration(duration, setError)) return;
    if (selectedPerson.id_type_personnel === 2) {
      if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (formatDate(startDate).getFullYear() === curr_date.getFullYear())
        && (selectedType.value === "congé administratif")) {
        setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles pour cette année");
        return;
      }
      if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (selectedType.value === "congé administratif")) {
        setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles");
        return;
      }
      // taking conge before the current year :
      if ((curr_date.getFullYear() - formatDate(startDate).getFullYear()) > 3) {
        setError(`Impossible de définir un congé pour plus de 3 ans en arrière !`);
        return;
      }
      setTimeout(() => {
        setError("");
      }, 7000)
    }
    // --> my last code for this section : (selectedType.value !== "congé maladie" || selectedType.value !== "congé maternité")
    if ((selectedPerson.id_type_personnel === 2 && ((selectedPerson.nb_jours_conges + selectedPerson.dette_conge) === 0)) && (selectedType.value === "congé administratif")) {
      setError(`${formatPersonnelName(sexe, name)} a déja epuisé tout ces congés pour l'année`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    // tests for all personnel
    if (formatDate(startDate).getDay() === 0 || formatDate(startDate).getDay() === 6) {
      setError("Le congé ne peut etre configurer que pour les jours ouvrables");
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    if (selectedType.value === "congé maternité" && selectedPerson.nb_jours_conges_maternite === 98) {
      setError(`${formatPersonnelName(sexe, name)} a déja eu un ${sexe === 'M' ? 'congé de paternité' : 'congé de maternité'} pour cette année`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    if (selectedType.value === "congé décès" && selectedPerson.nb_jours_conges_deces === 6) {
      setError(`${formatPersonnelName(sexe, name)} a épuisé son quota de congés de décès`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    if (selectedType.value === "congé maladie" && selectedPerson.nb_jours_conges_maladie === 90 && (formatDate(startDate).getFullYear() === curr_date.getFullYear())) {
      setError(`${formatPersonnelName(sexe, name)} a déja eu un congé maladie cette année`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    if (selectedType.value === "congé mariage" && selectedPerson.nb_jours_conges_mariage === 5 && (formatDate(startDate).getFullYear() === curr_date.getFullYear())) {
      setError(`${formatPersonnelName(sexe, name)} a déja eu un congé de mariage cette année`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    // tests for administratif personnel
    if (selectedPerson.id_type_personnel === 1) {
      if (duration > selectedPerson.nb_jours_conges && (selectedType.value === "congé administratif")) {
        setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
        setTimeout(() => {
          setError("");
        }, 7000)
        return;
      }
    }
    // -> last code for this section : (selectedType.value !== "congé maladie" || selectedType.value !== "congé maternité")
    if ((selectedPerson.id_type_personnel === 1 && selectedPerson.nb_jours_conges === 0) && (selectedType.value === "congé administratif")) {
      setError(`${formatPersonnelName(sexe, name)} a déja epuisé tout ces congés pour l'année`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    // verification of empty fields
    if (
      typeConge === "" || name === "" || startDate === "" || endDate === "" || duration === "" ||
      repriseDate === "" || selectedType.length <= 0 || selectedType === null || matricule === "" || type === "" || selectedDec === "" || struc === "" || poste === ""
    ) {
      setError('Veuillez remplir tous les champs');
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    // remove taking leave for the next-year
    if (formatDate(startDate).getFullYear() > curr_date.getFullYear()) {
      setError(`Impossible de définir un congé pour une année ultérieure`);
      return;
    }
    // taking lasts leaves date for blocking the same dates
    if (userConge.length > 0) {
      for (let index = 0; index < userConge.length; index++) {
        let csd = formatDate(startDate).getDate() + '/' + formatDateMonthForm(startDate) + '/' + formatDate(startDate).getFullYear();
        if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge))
          && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
          setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe, name)} a déja un congé prévu`);
          return;
        }
        if (((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge))
          || (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge)))
          && (userConge[index].statut_conge !== "annulé")) {
          setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe, name)} a déja pris un congé`);
          return;
        }
        if (formatDate(startDate) === formatDate(userConge[index].attestation_conge.date_debut_conge)) {
          setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe, name)} a un congé prévu cette meme date`);
          return;
        }
        if (formatDate(startDate) === formatDate(userConge[index].date_debut_conge)) {
          setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe, name)} a un congé prévu cette meme date`);
          return;
        }
        if (JSON.stringify(userConge[index].attestation_conge.repriseDate) === JSON.stringify(csd)) {
          setError(`Impossible de définir un congé pour cette date car la date de debut coïncide avec une date de reprise de service`);
          return;
        }
        setTimeout(() => {
          setError("");
        }, 7000)
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
    // controls about total_conge_admin
    if (duration < selectedPerson.nb_jours_conges + selectedPerson.dette_conge && total_conge_admin === 2 && selectedType.value === "congé administratif") {
      setDuration(selectedPerson.nb_jours_conges + selectedPerson.dette_conge);
      setError(`Ce congé constitue la 3ème partie du congé administratif de ${formatPersonnelName(sexe, name)} donc la durée doit être égale au nombre de jours restants`);
      setTimeout(() => {
        setError("");
      }, 7000)
      return;
    }
    // testings for lasts personnel permissions
    if (lastPermission.length > 0) {
      for (let i = 0; i < lastPermission.length; i++) {
        let csd = formatDate(startDate).getDate() + '/' + formatDateMonthForm(startDate) + '/' + formatDate(startDate).getFullYear();
        if (JSON.stringify(lastPermission[i].attestation_permission.repriseDate) === JSON.stringify(csd)) {
          setError(`Impossible de définir un congé pour cette date car la date de debut coïncide avec une date de reprise de service`);
          setTimeout(() => {
            setError("");
          }, 7000)
          return;
        }
      }
    }
    // leave attestation datas
    const attestation = {
      numero_conge_admin: calculateCongeAdmin(selectedType,duration,selectedPerson,total_conge_admin),
      name: name.replace(/'/g, "''"),
      matricule: matricule,
      sexe: sexe,
      poste: poste.replace(/'/g, "''"),
      type: type,
      decision: selectedDec,
      duration: duration,
      structure: struc.replace(/'/g, "''"),
      nb_jour_conges_restant: calculateRemainingDays(selectedPerson, duration),
      startDate: formatFullDate(startDate),
      endDate: formatFullDate(endDate),
      repriseDate: formatFullDate(repriseDate),
      typeConge: selectedType.value,
      preposition: preposition,
      grade: grade.replace(/'/g, "''"),
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    // datas for the leave
    const conge_data = {
      numero_conge_admin: calculateCongeAdmin(selectedType,duration,selectedPerson,total_conge_admin),
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      id_personnel: selectedPerson.id_personnel,
      curr_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      demande: demande,
      document: document,
      id_type_conge: getCongeTypeId(selectedType),
      statut_attestation_conge: "non archivé",
      statut_conge: getCongeStatus(curr_date, startDate, endDate),
      statut_personnel: getEmployeeSituation(curr_date, startDate, endDate)
    }
    // query for saving leaves
    const req_conge = `
        INSERT INTO conge (
          date_debut_conge, date_fin_conge, duree_conge, created_at_conge,attestation_conge,id_type_conge,
          id_personnel,demande_conge,statut_conge,statut_attestation_conge,document_a_fournir
        )
        VALUES ("
          ${conge_data.startDate}","${conge_data.endDate}",${conge_data.duration},"${conge_data.curr_date}",
          '${JSON.stringify(attestation)}',${conge_data.id_type_conge},${conge_data.id_personnel},"${conge_data.demandeFile}",
          "${conge_data.statut_conge}","${conge_data.statut_attestation_conge}","${conge_data.document}"
        );`;
    let req_personnel;
    switch (selectedType.value) {
      case 'congé maternité':
      case 'congé paternité':
        req_personnel = `
          UPDATE personnel SET nb_jours_conges_maternite = (nb_jours_conges_maternite + ${parseInt(duration)})
          WHERE id_personnel = ${conge_data.id_personnel}`;
        break;
      case 'congé maladie':
        req_personnel = `UPDATE personnel SET nb_jours_conges_maladie = (nb_jours_conges_maladie + ${parseInt(duration)})
          WHERE id_personnel = ${conge_data.id_personnel}`;
        break;
      case 'congé mariage':
        req_personnel = `UPDATE personnel SET nb_jours_conges_mariage	= (nb_jours_conges_mariage + ${parseInt(duration)})
          WHERE id_personnel = ${conge_data.id_personnel}`;
        break;
      case 'congé décès':
        req_personnel = `UPDATE personnel SET nb_jours_conges_deces = (nb_jours_conges_deces - ${parseInt(duration)})
          WHERE id_personnel = ${conge_data.id_personnel}`;
        break;
      default:
        req_personnel = '';
        break;
    }
    if (selectedPerson.nb_jours_conges === parseInt(0) && selectedPerson.dette_conge !== parseInt(0) && selectedPerson.dette_conge >= parseInt(duration)) {
      req_personnel = `UPDATE personnel SET dette_conge = (dette_conge - ${parseInt(duration)})
        WHERE id_personnel = ${conge_data.id_personnel};`;
    }
    if(selectedPerson.nb_jours_conges >= parseInt(duration)) {
      req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges - ${parseInt(duration)})
        WHERE id_personnel = ${conge_data.id_personnel};`;
    }
    if (selectedPerson.nb_jours_conges < parseInt(duration) && (selectedPerson.nb_jours_conges + selectedPerson.dette_conge) >= parseInt(duration)) {
      let diff_dette_conge = duration - selectedPerson.nb_jours_conges;
      req_personnel = `UPDATE personnel SET nb_jours_conges = (
        nb_jours_conges - ${parseInt(selectedPerson.nb_jours_conges)}
        ), dette_conge = (dette_conge - ${parseInt(diff_dette_conge)} )
        WHERE id_personnel = ${conge_data.id_personnel};`;
    }
    // saving leaves
    window.electronAPI.addConge(req_conge);
    if(req_personnel !== '') {
      window.electronAPI.updatePersonnel(req_personnel);
    }
    window.electronAPI.congeAddedSuccess(() => {
      setSuccess("congé ajouté avec succès");
      setStatus(`Le satut de ${formatPersonnelName(sexe, name)} a été mis à jour !`);
    });
    setTimeout(() => {
      setSuccess("");
    }, 3000)
    setActived(true);
  } catch (error) {
    console.error("Erreur saving congé : " + error.message);
  }
}

export { saveConge };