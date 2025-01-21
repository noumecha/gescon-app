export const saveConge = async (e, duration, setError, selectedPerson) => {
    e.preventDefault();
    try {
      if (duration <= 0) {
        setError(`La durée du congé ne peut pas etre négative ou égale à 0`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      // testing for contractual personnel
      if (selectedPerson.id_type_personnel === 2) {
        if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (formatDate(startDate).getFullYear() === curr_date.getFullYear()) && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles pour cette année");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
        if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
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
        // --> my last code for this section : (selectedType !== "congé maladie" || selectedType !== "congé maternité")
      if ((selectedPerson.id_type_personnel === 2 && ((selectedPerson.nb_jours_conges + selectedPerson.dette_conge) === 0)) && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
        setError(`${formatPersonnelName(sexe)} a déja epuisé tout ces congés pour l'année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      // tests for all personnel
      if (formatDate(startDate).getDay() === 0 || formatDate(startDate).getDay() === 6) {
        setError("Le congé ne peut etre configurer que pour les jours ouvrables");
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedType === "congé maternité" && selectedPerson.nb_jours_conges_maternite === 98) {
        setError(`${formatPersonnelName(sexe)} a déja eu un ${sexe === 'M' ? 'congé de paternité' : 'congé de maternité'} pour cette année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedType === "congé décès" && selectedPerson.nb_jours_conges_deces === 6) {
        setError(`${formatPersonnelName(sexe)} a épuisé son quota de congés de décès`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedType === "congé maladie" && selectedPerson.nb_jours_conges_maladie === 90 && (formatDate(startDate).getFullYear() === curr_date.getFullYear())) {
        setError(`${formatPersonnelName(sexe)} a déja eu un congé maladie cette année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedType === "congé mariage" && selectedPerson.nb_jours_conges_mariage === 5 && (formatDate(startDate).getFullYear() === curr_date.getFullYear())) {
        setError(`${formatPersonnelName(sexe)} a déja eu un congé de mariage cette année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      // tests for administratif personnel
      if (selectedPerson.id_type_personnel === 1) {
        if (duration > selectedPerson.nb_jours_conges && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
      }
        // -> last code for this section : (selectedType !== "congé maladie" || selectedType !== "congé maternité")
      if ((selectedPerson.id_type_personnel === 1 && selectedPerson.nb_jours_conges === 0) && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
        setError(`${formatPersonnelName(sexe)} a déja epuisé tout ces congés pour l'année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      // verification of empty fields
      if (typeConge === "" || name === "" || startDate === "" || endDate === "" || duration === "" || repriseDate === "" || selectedType === "" || matricule === "" || type === "" || selectedDec === "" || struc === "" || poste === "") {
        setError('Veuillez remplir tous les champs');
        setTimeout(() => {
          setError("");
        }, 7000)
        return;
      }
      // remove taking leave for the next-year
      if (formatDate(startDate).getFullYear() > curr_date.getFullYear()) {
        setError(`Impossible de définir un congé pour une année ultérieure`);
        setTimeout(() => {
            setError("");
        },7000)
        return;
      }
     // taking lasts leaves date for blocking the same dates
      if (userConge.length > 0) {
        for (let index = 0; index < userConge.length; index++) {
          let csd = formatDate(startDate).getDate() + '/' + formatDateMonthForm(startDate) + '/' + formatDate(startDate).getFullYear();
          nbDaysConges += nbDaysBetween(formatDate(userConge[index].date_debut_conge),formatDate(userConge[index].date_fin_conge)) + 1;
          console.log(nbDaysConges);
          if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
            //console.log(`1`);
            setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe)} a déja un congé prévu`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
          if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) || (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
            //console.log(`2`);  
            setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe)} a déja pris un congé`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
          if (formatDate(startDate) === formatDate(userConge[index].attestation_conge.date_debut_conge)) {
            //console.log(`3`);
            setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe)} a un congé prévu cette meme date`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
          if (formatDate(startDate) === formatDate(userConge[index].date_debut_conge)) {
            //console.log(`3`);
            setError(`Impossible de définir un congé pour cette date car ${formatPersonnelName(sexe)} a un congé prévu cette meme date`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
          if (JSON.stringify(userConge[index].attestation_conge.repriseDate) === JSON.stringify(csd)) {
            setError(`Impossible de définir un congé pour cette date car la date de debut coïncide avec une date de reprise de service`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
        }
      }
      // testings for lasts personnel permissions
      if (lastPermission.length > 0) {
        for (let i = 0; i < lastPermission.length; i++) {
          let csd = formatDate(startDate).getDate() + '/' + formatDateMonthForm(startDate)  + '/' + formatDate(startDate).getFullYear();
          //console.log(`curr start date : ${JSON.stringify(csd)}`);
          //console.log(` last permission repdate : ${JSON.stringify(lastPermission[i].attestation_permission.repriseDate)}`);
          if (JSON.stringify(lastPermission[i].attestation_permission.repriseDate) === JSON.stringify(csd)) {
            setError(`Impossible de définir un congé pour cette date car la date de debut coïncide avec une date de reprise de service`);
            setTimeout(() => {
                setError("");
            },7000)
            return;
          }
        }
      }
      // leave attestation datas
      const attestation = {
        name: name,
        matricule: matricule,
        sexe: sexe,
        poste: poste.replace("'", "`"), 
        type: type,
        decision: selectedDec, 
        duration: duration,
        structure: struc.replace("'", "`"),
        nbJoursConge : nb_jours_conges,
        startDate: formatDateDayForm(startDate) + "/" + formatDateMonthForm(startDate) +"/"+formatDate(startDate).getFullYear(),
        endDate: formatDateDayForm(endDate) + "/" + formatDateMonthForm(endDate) + "/"+formatDate(endDate).getFullYear(),
        repriseDate: formatDateDayForm(repriseDate) + "/" + formatDateMonthForm(repriseDate) + "/" + formatDate(repriseDate).getFullYear(),
        typeConge: selectedType,
        preposition: preposition,
        grade : grade.replace("'", "`"),
        created_at : new Date().toISOString().slice(0,19).replace('T',' ')
      }
      // datas for the leave
      const conge_data = {
        startDate : startDate,
        endDate : endDate,
        duration : duration,
        id_personnel: selectedPerson.id_personnel,
        curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
        demande : demande,
        document : document,
        id_type_conge : selectedType === "congé administratif partiel" ? 1 : selectedType === "congé administratif total" ? 2 : selectedType === "congé maternité" || selectedType === "congé paternité" ? 3 : selectedType === "congé maladie" ? 4 : selectedType === "congé mariage" ? 7 : selectedType === "congé décès" ? 8 : 0,
        statut_attestation_conge : "non archivé",
        statut_conge : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en cours" : curr_date.toISOString().slice(0,19).replace('T',' ') >= endDate ? "terminé" : "programmé",
        statut_personnel : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en congé" : "en poste",
      }
      // query for saving leaves
      const req_conge = `INSERT INTO conge 
        (date_debut_conge, date_fin_conge, duree_conge, created_at_conge,attestation_conge,id_type_conge,id_personnel,demande_conge,statut_conge,statut_attestation_conge,document_a_fournir) 
        VALUES ("${conge_data.startDate}","${conge_data.endDate}",${conge_data.duration},"${conge_data.curr_date}",'${JSON.stringify(attestation)}',${conge_data.id_type_conge},${conge_data.id_personnel},"${conge_data.demandeFile}","${conge_data.statut_conge}","${conge_data.statut_attestation_conge}","${conge_data.document}");`;
      let req_personnel;
      switch (selectedType) {
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
      if (selectedPerson.nb_jours_conges === parseInt(0)) {
        req_personnel = `UPDATE personnel SET dette_conge = (dette_conge - ${parseInt(duration)}) WHERE id_personnel = ${conge_data.id_personnel};`;
      } else {
        let diff_dette_conge = duration - selectedPerson.nb_jours_conges;
        req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges - ${parseInt(selectedPerson.nb_jours_conges)}), dette_conge = (dette_conge - ${parseInt(diff_dette_conge)} ) WHERE id_personnel = ${conge_data.id_personnel};`;
      }
      // saving leaves
      /*console.log(req_personnel);
      console.log(req_conge);*/
      setSuccess("congé ajouté avec succès");
      window.electronAPI.addConge(req_conge);
      window.electronAPI.updatePersonnel(req_personnel);
      window.electronAPI.congeAddedSuccess(() => { 
        setSuccess("congé ajouté avec succès");
        setStatus(`Le satut de ${formatPersonnelName(sexe)} a été mis à jour !`);
      });
      setTimeout(() => {
        setSuccess("");
      }, 3000)
      setActived(true);
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
  }