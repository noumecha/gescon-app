import { Container } from "reactstrap";
// custom compontents : 
import CongesTable from "views/customs-components/CongesTable";
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CongesForm from "views/customs-components/CongesForm";
// useful functions 
import { fetchDatas } from "utils/fetchDatas";
//import { saveConge } from "utils/saveConge";

const Conges = () => {
  const location = useLocation();
  // recuperation des attributs d'un personnel depuis personnel.js
  const { selectedPerson } = location.state || {};
  // variables et leurs stateHook
  //const [decision, setDecision] = useState([]);
  const [userConge, setUserConge] = useState([]);
  const [lastPermission, setLastPermission] = useState([]);
  const [typeConge, setTypeConge] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repriseDate, setRepriseDate] = useState("");
  const [selectedType, setSelectedType] = useState(typeConge.length > 0 ? typeConge[0].libelle_type_conge : "congé administratif");
  const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
  const preposition = selectedPerson ? selectedPerson.preposition_personnel : "au";
  const grade = selectedPerson ? selectedPerson.grade_personnel : "GRADE";
  const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
  const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
  const [selectedDec, setSelectedDec] = useState("");
  const [struc, setStruc] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
  const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
  const sexe = !selectedPerson ? "M" : selectedPerson.sexe_personnel ;
  const nb_jours_conges = selectedPerson ? selectedPerson.nb_jours_conges + selectedPerson.dette_conge : 18;
  const [telephone, setTelphone] = useState(selectedPerson ? selectedPerson.telephone_personnel : 696879475);
  const [demande, setDemande] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState("");
  const [status, setStatus] = useState(`${formatPersonnelName(sexe)} a ${nb_jours_conges} ${nb_jours_conges > 1 ? "jours" : "jour"} de congés disponibles`);
  const [visible, setVisible] = useState(true);
  const [conge, setConge] = useState([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage] = useState(100);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const id_personnel = selectedPerson ? selectedPerson.id_personnel : "1";
  const loadingText = "Aucune donnée dans la base de données";
  const [actived, setActived] = useState(selectedPerson === undefined ? true : false);
  const curr_date = new Date();
  const [duration, setDuration] = useState(selectedPerson ? selectedPerson.nb_jours_conges + selectedPerson.dette_conge : "");

  // completion varaibles for functions
  let nbDaysConges = 0;

  const filterConge = search !== "" || statutFilter !== ""
    ? conge.filter(conge => conge.statut_conge.includes(statutFilter) && (
      conge.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) 
      || conge.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : conge
  
  const pageCount = Math.ceil(conge.length/perPage);
  const offset = pageNumber * perPage;

  const handlePageChange = ({selected}) => {
    setPageNumber(selected);
  }
  const handlePagePrev = () => {
    setPageNumber(pageCount <= 1 || pageNumber === 0 ? pageNumber : pageNumber - 1);
  }
  const handlePageNext = () => {
    setPageNumber(pageCount <= 1 || pageCount === pageNumber + 1 ? pageNumber : pageNumber + 1);
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  
  const handleStatutFilter = (e) => {
    setStatutFilter(e.target.value);
  }      
  const onDismiss = () => setVisible(false)

  const handleInputChange = (setStateFunction) => (e) => {
    setStateFunction(e.target.value);
  };

  const handleFileChange = (setStateFunction) => (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64 = reader.result;
        setStateFunction(base64);
    }
    reader.readAsDataURL(file);
  }

  const validateDuration = () => {
    if (duration <= 0) {
      setError(`La durée du congé ne peut pas etre négative ou égale à 0`);
      setTimeout(() => {
        setError("");
      },7000)
      return false;
    }
    return true;
  };

  const saveConge = async (e) => {
    e.preventDefault();
    try {
      if (!validateDuration()) return;
      // testing for contractual personnel
      if (selectedPerson.id_type_personnel === 2) {
        if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (formatDate(startDate).getFullYear() === curr_date.getFullYear()) && (selectedType === "congé administratif")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponibles pour cette année");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
        if ((duration > selectedPerson.nb_jours_conges + selectedPerson.dette_conge) && (selectedType === "congé administratif")) {
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
      if ((selectedPerson.id_type_personnel === 2 && ((selectedPerson.nb_jours_conges + selectedPerson.dette_conge) === 0)) && (selectedType === "congé administratif")) {
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
        if (duration > selectedPerson.nb_jours_conges && (selectedType === "congé administratif")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
      }
        // -> last code for this section : (selectedType !== "congé maladie" || selectedType !== "congé maternité")
      if ((selectedPerson.id_type_personnel === 1 && selectedPerson.nb_jours_conges === 0) && (selectedType === "congé administratif")) {
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
        id_type_conge : selectedType === "congé administratif" ? 1 : selectedType === "congé administratif" ? 2 : selectedType === "congé maternité" || selectedType === "congé paternité" ? 3 : selectedType === "congé maladie" ? 4 : selectedType === "congé mariage" ? 7 : selectedType === "congé décès" ? 8 : 0,
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
      //console.log(req_personnel);
      //console.log(req_conge);
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

  const saveAttestationRepConge = async (c) => {
    try {
      c.attestation_conge = JSON.stringify(c.attestation_conge);
      c.attestation_conge = JSON.parse(c.attestation_conge);
      const attestation_reprise = {
        name: c.attestation_conge.name,
        matricule: c.attestation_conge.matricule,
        sexe: c.attestation_conge.sexe,
        poste: c.attestation_conge.poste, 
        type: c.attestation_conge.type,
        decision: c.attestation_conge.decision, 
        duration: c.attestation_conge.duration,
        structure: c.attestation_conge.structure,
        startDate: c.attestation_conge.startDate,
        endDate: c.attestation_conge.endDate,
        repriseDate: c.attestation_conge.repriseDate,
        typeConge: c.attestation_conge.typeConge,
        preposition : c.attestation_conge.preposition,
        grade : c.attestation_conge.grade,
        created_at : new Date().toISOString().slice(0,19).replace('T',' ')
      }
      const created_at_att_rep_conge = new Date().toISOString().slice(0,19).replace('T',' ');
      const req = `UPDATE conge SET created_at_reprise_service = "${created_at_att_rep_conge}",attestation_reprise_service='${JSON.stringify(attestation_reprise)}',statut_att_rep_conge="non archivé" WHERE ${c.id_conge}=conge.id_conge`; 
      window.electronAPI.addArchiveAttestationRepConge(req);
      await window.electronAPI.addArchiveAttCongeRepSuccess((event, res) => {
        setGenerateSuccess("Attestation de reprise générer avec succès");
        console.log(`Le satut de ${attestation_reprise.sexe === 'M' ? 'M.' : 'Mme'} ${name} a été mis à jour !`);
      });
      setTimeout(() => {
        setGenerateSuccess("");
      }, 3000)
      setActived(true);
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
  }

  function formatDate(d) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  }

  
  function formatPersonnelName(s) {
    if (s === 'M')
      return 'M. ' + name
    else
      return 'Mme ' + name
  }

  function formatDateDayForm(date) {
    if (formatDate(date).getDate() < 10 ) 
      return "0"+formatDate(date).getDate()
    else 
      return formatDate(date).getDate()
  }

  function formatDateMonthForm(date) {
    if (parseInt(formatDate(date).getMonth()+1) >= 10) 
      return parseInt(formatDate(date).getMonth()+1)
    else 
      return "0"+parseInt(formatDate(date).getMonth()+1)
  }

  function nbDaysBetween(start, end) {
    return parseInt(Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  }

  // useEffect for calculate the end conge date base on the start date and duration
  useEffect(() => {
    const changeDuration = () => {
      if (selectedPerson && selectedType === "congé maternité" && selectedPerson.sexe_personnel !== "M") {
        setDuration("98");
      }
      if (selectedPerson && selectedType === "congé paternité" && selectedPerson.sexe_personnel === "M") {
        setDuration("3");
      }
      if (selectedPerson && selectedType === "congé mariage") {
        setDuration("5");
      }
      if (selectedPerson && selectedType === "congé maladie") {
        setDuration("90");
      }
      if (selectedPerson && selectedType === "congé décès") {
        setDuration("3");
      }
    };
    const calculateEndDate = () => {
      if (startDate && duration) {
        if (selectedPerson.id_type_personnel === 2 && (selectedType === "congé administratif" || selectedType === "congé administratif")) {
          let st = new Date(startDate);
          let weekdaysToAdd = duration - 1;
          while (weekdaysToAdd > 0) {
            st.setDate(st.getDate() + parseInt(1));
            if (st.getDay() !== 0 && st.getDay() !== 6) {
              weekdaysToAdd--;
            }
          }
          console.log('end date calculate : ' + st);
          let next_day = new Date(st);
          let rep = new Date(st);
          console.log('before', next_day.getDay());
          next_day.setDate(next_day.getDate() + parseInt(1));
          console.log('after', next_day.getDay());
          console.log(next_day);
          if (next_day.getDay() === 0 || next_day.getDay() === 6) {
            rep.setDate(st.getDate() + parseInt(3));
            console.log("rep date : " + rep);
          } else {
            rep.setDate(st.getDate() + parseInt(1));
            console.log("rep date : " + rep);
          }
          setEndDate(st.toISOString().split("T")[0]);
          console.log("rep date formated " + rep.toISOString().split("T")[0]);
          setRepriseDate(rep.toISOString().split("T")[0]);
        } else {
          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + parseInt(duration - 1));
          setEndDate(end.toISOString().split("T")[0]);
          const repDate = new Date(end);
          repDate.setDate(end.getDate() + parseInt(1));
          setRepriseDate(repDate.toISOString().split("T")[0]);
        }
      }
    };
    const changeLibelle = () => {
        if (typeConge.length > 0) {
          for (let i = 0; i < typeConge.length; i++) {
            if (typeConge[i].libelle_type_conge === "congé maternité" && selectedPerson && selectedPerson.sexe_personnel === "M") {
              typeConge[i].libelle_type_conge = "congé paternité";
            }
          }
        }
    };
    changeLibelle();
    calculateEndDate();
    changeDuration();
  }, [startDate, duration,typeConge,selectedType, selectedPerson]);

  /** useEffect for updating personnel and congé base on some state of current date */
  useEffect(() => {
    const updatePersonnelState = async () => {
      try {
      //const statut = curr_date >= conge_data.startDate && curr_date <= conge_data.endDate ? "en congé" : "en poste";
      if (conge.length > 0) {
        let date = new Date();
        for (let x = 0; x < conge.length; x++) {
          conge[x].attestation_conge = JSON.parse(conge[x].attestation_conge);
          conge[x].attestation_conge.repriseDate = conge[x].attestation_conge.repriseDate.split('/');
          conge[x].attestation_conge.repriseDate = new Date(conge[x].attestation_conge.repriseDate[2], conge[x].attestation_conge.repriseDate[1], conge[x].attestation_conge.repriseDate[0]);
          /*console.log(`<--- conge ${x} --->`);
          console.log(`current date : ${date}`);
          console.log(`date ddc : ${conge[x].date_debut_conge}`);
          console.log(`date dfc : ${conge[x].date_fin_conge}`);
          console.log(`attesttaion : ${conge[x].attestation_conge.repriseDate}`);*/
          if (date >= conge[x].date_debut_conge && date <= conge[x].date_fin_conge) {
            const statut = "en congé";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
            console.log("le statut du personnel a été mis à jour");
          }
          if ((date.getDate() === conge[x].date_fin_conge.getDate() && date.getMonth() === conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear())) {
            const statut_conge = "terminé";
            const req_conge = `UPDATE conge SET statut_conge = "${statut_conge}" WHERE id_conge = ${conge[x].id_conge}`;
            window.electronAPI.addConge(req_conge);
            console.log(`Le congé de ${conge[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${conge[x].nom_prenom_personnel} a été actualisé`);
            console.log(`Le satut du congé de ${conge[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${conge[x].nom_prenom_personnel} a été mis à jour !`);  
            setTimeout(() => {
              setSuccess("");
            }, 3000)
          }
          if (date.getMonth() > conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear()) {
            const statut_conge = "terminé";
            const req_conge = `UPDATE conge SET statut_conge = "${statut_conge}" WHERE id_conge = ${conge[x].id_conge}`;
            window.electronAPI.addConge(req_conge);
            console.log(`Le congé de ${conge[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${conge[x].nom_prenom_personnel} a été actualisé`);
            console.log(`Le satut du congé de ${conge[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${conge[x].nom_prenom_personnel} a été mis à jour !`);  
            setTimeout(() => {
              setSuccess("");
            }, 3000)
          }
          if (date.getDate() === conge[x].attestation_conge.repriseDate.getDate() && date.getMonth() === conge[x].attestation_conge.repriseDate.getMonth() && date.getFullYear() === conge[x].attestation_conge.repriseDate.getFullYear()) {
            const statut = "en poste";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
            console.log("le personnel est désormais en poste");
          }
          if (date.getMonth() > conge[x].attestation_conge.repriseDate.getMonth() && date.getFullYear() === conge[x].attestation_conge.repriseDate.getFullYear()) {
            const statut = "en poste";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
            console.log("le personnel est désormais en poste");
          }
        }
      }
      } catch (err) {
        console.error("Erreur : " + err.message);
      }
    }
    updatePersonnelState()
  }, [conge]);

  // useEffect for getting data
  useEffect(() => {
    const getSpecificConge = async () => {
      try {
          const test_conge_req = `SELECT * FROM conge WHERE id_personnel = ${id_personnel}`;
          window.electronAPI.getSpecificConge(test_conge_req);
          await window.electronAPI.retrieveSpecificConge((event, res) => {
            for (let index = 0; index < res.length; index++) {
              res[index].attestation_conge = JSON.parse(res[index].attestation_conge)                                                
            }
            setUserConge(res);
          })
      } catch (error) {
          console.error("Erreur : " + error.message);
      }
    }
    getSpecificConge();
    fetchDatas(setConge, setLoadingSpinner, setSelectedDec, setTypeConge, setLastPermission, selectedPerson, id_personnel);
  },[]);

  const handleRefresh = () => {
    try {
      setLoadingSpinner(true);
      setTimeout(() => 
      setLoadingSpinner(false)
      , 3000);
      fetchDatas(setConge, setLoadingSpinner, setSelectedDec, setTypeConge, setLastPermission, selectedPerson, id_personnel);
      console.log("datas refreshed successfully");
    } catch (err) {
      console.error("error on refresh : " + err.message);
    }
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
          <CongesTable 
            loadingText={loadingText}
            saveAttestationRepConge={saveAttestationRepConge}
            loadingSpinner={loadingSpinner}
            pageCount={pageCount}
            handlePagePrev={handlePagePrev}
            handlePageChange={handlePageChange}
            handlePageNext={handlePageNext}
            pageNumber={pageNumber}
            handleStatutFilter={handleStatutFilter}
            statutFilter={statutFilter}
            handleSearch={handleSearch}
            search={search}
            generateSuccess={generateSuccess}
            handleRefresh={handleRefresh}
            filterConge={filterConge}
            offset={offset}
            perPage={perPage}
            formatDateMonthForm={formatDateMonthForm}
            curr_date={curr_date}
          />
          <CongesForm
            name={name}
            status={status}
            visible={visible}
            onDismiss={onDismiss}
            setName={setName}
            setTelphone={setTelphone}
            telephone={telephone}
            matricule={matricule}
            setMatricule={setMatricule}
            poste={poste}
            setPoste={setPoste}
            type={type}
            setType={setType}
            struc={struc}
            setStruc={setStruc}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            typeConge={typeConge}
            handleFileChange={handleFileChange}
            setDemande={setDemande}
            setDocument={setDocument}
            handleInputChange={handleInputChange}
            setStartDate={setStartDate}
            startDate={startDate}
            duration={duration}
            setDuration={setDuration}
            endDate={endDate}
            selectedDec={selectedDec}
            error={error}
            success={success}
            saveConge={saveConge}
            actived={actived}
          />
      </Container>
    </>
  );
};

export default Conges;
