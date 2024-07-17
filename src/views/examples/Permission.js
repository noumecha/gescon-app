import {
    Card,
    Button,
    CardHeader,
    CardBody,
    FormGroup,
    FormText,
    Form,
    Input,
    Label,
    Col,
    Container,
    Row,
    Alert,
    Table,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";

const Permission = () => {
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    const [endDate, setEndDate] = useState("");
    const [repDate, setRepDate] = useState("");
    const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
    const [telephone, setTelephone] = useState(selectedPerson ? selectedPerson.telephone_personnel : "653465348");
    const [startDate, setStartDate] = useState("");
    const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
    const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
    const [structure, setStructure] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
    const [duration, setDuration] = useState("");
    const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
    const [demande, setDemande] = useState(null);
    const sexe = selectedPerson ? selectedPerson.sexe_personnel : "M"; 
    const preposition = selectedPerson ? selectedPerson.preposition_personnel : "au";
    const grade = selectedPerson ? selectedPerson.grade_personnel : "au";
    const id_personnel = selectedPerson ? selectedPerson.id_personnel : "1";
    const [permission, setPermission] = useState([]);
    const [lastPermission, setLastPermission] = useState([]);
    const curr_date = new Date();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const nb_jours_permission = selectedPerson ? selectedPerson.nb_jours_permission : 0;
    const [status, setStatus] = useState(nb_jours_permission === 0 ? `les nouvelles permissions de ${sexe === 'M' ? 'M.' : 'Mme'} ${name} seront déduites de ses jours de congés` : `${sexe === 'M' ? 'M.' : 'Mme'} ${name} a ${nb_jours_permission} ${nb_jours_permission > 1 ? "jours" : "jour"} de ${nb_jours_permission > 1 ? "permissions" : "permission"} ${nb_jours_permission > 1 ? "disponibles" : "disponible"}`);
    const [visible, setVisible] = useState(true);
    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [userConge, setUserConge] = useState([]);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";
    const [actived, setActived] = useState(selectedPerson === undefined ? true : false);
    let total_lasts_days = 0;
    let nbDaysConges = 0;
    let nbDayPermCurrMonth = {
        month: 0,
        amount: 0,
    };
    let nextMonthPermNb = {
        month: -1,
        amount : 0,
    };
    let nb = 0; // total days of permission for specifc month (particularly the month of the start date)

    // usefull function   
    const filterPermission = search !== "" || status !== ""
    ? permission.filter(permission => permission.statut_permission.includes(statutFilter) && (
        permission.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) 
        || permission.matricule_personnel.toLowerCase().includes(search.toLowerCase())
      ))
      : permission
    
    const pageCount = Math.ceil(permission.length/perPage);
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

    function firstDateOfMonth(d){
		var date = new Date(d);
        var y = date.getFullYear();
        var m = date.getMonth();
		var firstDay = new Date(y, m, 1);
		return firstDay;
	}

    function lastDateOfMonth(d){
		var date = new Date(d);
        var y = date.getFullYear();
        var m = date.getMonth();
		var lastDay = new Date(y, m + 1, 0);
		return lastDay;

    }

    function dateInRange(d, start, end) {
        if (d >= start && d <= end) {
            return true;
        } else {
            return false;
        }
    }

    function formatDate(d) {
        const date = new Date(d);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month, day);
    }

    function nbDaysBetween(start, end) {
        return parseInt(Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    }

    const monthToText = (n) => {
        switch (n) {
            case 0:
                return 'Janvier';
            case 1:
                return 'Fevrier';
            case 2:
                return "Mars";
            case 3:
                return "Avril";
            case 4:
                return "Mai";
            case 5:
                return "Juin";
            case 6:
                return "Juillet";
            case 7:
                return "Août";
            case 8:
                return "Septembre";
            case 9:
                return "Octobre";
            case 10:
                return "Novembre";
            case 11:
                return "Decembre";
            default:
                break;
        }
    }
    
  const saveAttestationRepPermission = async (p) => {
    try {
      p.attestation_permission = JSON.stringify(p.attestation_permission);
      p.attestation_permission = JSON.parse(p.attestation_permission);
      console.log(`we are goin to generate an attestation of reprise for conge ${JSON.stringify(p.attestation_permission)}`);
      const attestation_reprise = {
        name: p.attestation_permission.name,
        matricule: p.attestation_permission.matricule,
        sexe: p.attestation_permission.sexe,
        poste: p.attestation_permission.poste, 
        type: p.attestation_permission.type,
        decision: p.attestation_permission.decision, 
        duration: p.attestation_permission.duration,
        structure: p.attestation_permission.structure,
        startDate: p.attestation_permission.startDate,
        endDate: p.attestation_permission.endDate,
        repriseDate: p.attestation_permission.repriseDate,
        typeConge: p.attestation_permission.typeConge,
        preposition: p.attestation_permission.preposition,
        grade : p.attestation_permission.grade,
        created_at : new Date().toISOString().slice(0,19).replace('T',' ')
      }
      const created_at_att_rep_permission = new Date().toISOString().slice(0,19).replace('T',' ');
      const req = `UPDATE permission SET created_at_reprise_permission = "${created_at_att_rep_permission}",attestation_reprise_permission='${JSON.stringify(attestation_reprise)}',statut_att_reprise_permission="non archivé" WHERE ${p.id_permission}=permission.id_permission`; 
      window.electronAPI.addArchiveAttestationRepPermission(req);
      await window.electronAPI.addArchiveAttPermissionRepSuccess((event, res) => {
        console.log("Attestation de reprise générer avec succès");
      });
      setSuccess("Attestation de reprise générer avec succès");
      setStatus(`Le satut de ${sexe === 'M' ? 'M.' : 'Mme'} ${name} a été mis à jour !`);
      setTimeout(() => {
        setSuccess("");
      }, 3000)
      setActived(true);
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
  }

    // calculate the end date from startdate and duration
    useEffect(() => {
        const calculateEndDate = () => {
          if (startDate && duration) {
            let st = new Date(startDate);
            let weekdaysToAdd = duration - 1;
            while (weekdaysToAdd > 0) {
              st.setDate(st.getDate() + 1);
              if (st.getDay() !== 0 && st.getDay() !== 6) {
                weekdaysToAdd--;
              }
            }
            let next_day = new Date();
            let rep = new Date();
            next_day.setDate(st.getDate() + 1);
            if (next_day.getDay() === 0 || next_day.getDay() === 6) {
              rep.setDate(st.getDate() + 3);
            } else {
              rep.setDate(st.getDate() + 1);
            }
            setEndDate(st.toISOString().split("T")[0]);
            setRepDate(rep.toISOString().split("T")[0]);
          }
        };
        calculateEndDate();
    }, [startDate, duration, repDate]);

    const handleFileChange = (setStateFunction) => (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = reader.result;
          setStateFunction(base64);
      }
      reader.readAsDataURL(file);
    }

    // fetching permissions form db
    const fetchDatas = async () => {
        try {
            window.electronAPI.getPermission();
            await window.electronAPI.retrievePermission((event, res) => {
                setPermission(res);
                setTimeout(() => 
                setLoadingSpinner(false)
                , 3000);
            })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }

    // saving congé
    const savePermission = async (e) => {
        e.preventDefault();
        try {
            if (!selectedPerson) {
                setError(`Veuillez d'abord selectionner un personnel`);
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
            if (duration <= 0) {
                setError(`La durée de la permission ne peut pas etre négative ou égale à 0`);
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
            if (selectedPerson.statut_personnel !== "en poste") {
                for (let index = 0; index < userConge.length; index++) {
                    if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
                        setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} est ${selectedPerson.statut_personnel}`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                }
            }
            if (formatDate(startDate).getDay() === 0 || formatDate(startDate).getDay() === 6) {
              setError("Les permissions ne peuvent être configurer que pour les jours ouvrables");
              setTimeout(() => {
                setError("");
              },7000)
              return;
            }
            if (userConge.length > 0) {
                for (let index = 0; index < userConge.length; index++) {
                    /**** using this for checking if the repDate corresponds to the conge debut date
                    console.log(`curr rep date : ${formatDate(repDate).getDate()}`);
                    console.log(`curr debut conge date : ${formatDate(userConge[index].date_debut_conge).getDate()}`)*/
                    //nbDaysConges += nbDaysBetween(formatDate(userConge[index].date_debut_conge),formatDate(userConge[index].date_fin_conge)) + 1;
                    nbDaysConges += userConge[index].duree_conge;
                    if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
                        setError(`Impossible de définir une permission pour cette date car ${sexe === 'M' ? 'M.' : 'Mme'} ${name} a un congé prévu`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                    if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) || (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
                        setError(`Impossible de définir une permission pour cette date car ${sexe === 'M' ? 'M.' : 'Mme'} ${name} a un congé prévu`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                    if (formatDate(startDate).getDate() === formatDate(userConge[index].date_debut_conge).getDate() && formatDate(startDate).getMonth() === formatDate(userConge[index].date_debut_conge).getMonth() && formatDate(startDate).getFullYear() === formatDate(userConge[index].date_debut_conge).getFullYear() ) {
                        setError(`Impossible de définir une permission pour cette date car ${sexe === 'M' ? 'M.' : 'Mme'} ${name} a un congé prévu cette meme date`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                    if (formatDate(repDate).getDate() === formatDate(userConge[index].date_debut_conge).getDate() && formatDate(repDate).getMonth() === formatDate(userConge[index].date_debut_conge).getMonth() && formatDate(repDate).getFullYear() === formatDate(userConge[index].date_debut_conge).getFullYear()) {
                        setError(`Impossible de définir une permission pour cette date car ${sexe === 'M' ? 'M.' : 'Mme'} ${name} prendra un congé prévu à cette meme date`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                }
            }
            if (lastPermission.length > 0) {
                for (let i = 0; i < lastPermission.length; i++) {                   
                    let lprd = new Date(formatDate(lastPermission[i].date_fin_permission));
                    lprd.setDate(lprd.getDate() + 1);
                    /**** using this for checking if the repDate corresponds to the conge debut date
                    console.log(`============================ Permission ${i} =============================`);
                    //console.log(`curr rep date : ${formatDate(repDate)}`);
                    //console.log(`last permission start date : ${formatDate(lastPermission[i].date_debut_permission)}`)
                    console.log(`current permission start date : ${formatDate(startDate)}`)
                    console.log(`last permission rep date : ${lprd}`)
                    console.log(`================================= [${i}] =================================`);*/ 
                    total_lasts_days += nbDaysBetween(formatDate(lastPermission[i].date_debut_permission),formatDate(lastPermission[i].date_fin_permission)) + 1;
                    let fd = new Date(firstDateOfMonth(formatDate(lastPermission[i].date_debut_permission)));
                    for (let x = 0; x < lastPermission[i].duree_permission; x++) {
                        //console.log(`permission ${i} -> date ${x} : ${fd}`);
                        if (formatDate(startDate).getMonth() === fd.getMonth()) {
                            nb += 1;
                        }
                        fd.setDate(fd.getDate() + 1);
                    }
                    if (formatDate(startDate) >= formatDate(lastPermission[i].date_debut_permission) && formatDate(endDate) <= formatDate(lastPermission[i].date_fin_permission)) {
                        setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a déja pris une permission pour cette periode`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                    if ((formatDate(startDate) >= formatDate(lastPermission[i].date_debut_permission) && formatDate(startDate) <= formatDate(lastPermission[i].date_fin_permission)) || (formatDate(endDate) >= formatDate(lastPermission[i].date_debut_permission) && formatDate(endDate) <= formatDate(lastPermission[i].date_fin_permission))) {
                        setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a déja pris une permission pour cette periode`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                    if (formatDate(startDate).getDate() === lprd.getDate() && formatDate(startDate).getMonth() === lprd.getMonth() && formatDate(startDate).getFullYear() === lprd.getFullYear()) {
                        setError(`Impossible de definir une permission à partir de cette date car ${sexe === 'M' ? 'M.' : 'Mme'} ${name} sera de retour d'une permission`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                }
                //
                if (formatDate(startDate).getMonth() === selectedPerson.next_month_permission.month) {
                    nb = parseInt(selectedPerson.next_month_permission.amount);
                }
                // testing values : 
                console.log(`total dconges days for this user : ${nbDaysConges}`);
                console.log(`current month : ${formatDate(startDate).getMonth()}`);
                console.log(`next month value in db : ${selectedPerson.next_month_permission.month}`);
                console.log(`current month total permissions for this user : ${nb}`);
                console.log(`total permission for this user : ${total_lasts_days}`);
                // work
                if (nb === 3 && formatDate(startDate) <= lastDateOfMonth(formatDate(startDate)) && formatDate(endDate) > lastDateOfMonth(formatDate(startDate))) {
                    setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a déja pris 3 jours de permissions le mois de ${monthToText(formatDate(startDate).getMonth())}`);
                    setTimeout(() => {
                        setError("");
                    },7000)
                    return;
                }
                // work
                if (nb >= 3) {
                    setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a déja pris 3 jours de permissions ce mois`);
                    setTimeout(() => {
                        setError("");
                    },7000)
                    return;
                }
                //
                if (nb === 2 && duration > 1  && (lastDateOfMonth(startDate).getDate() - formatDate(startDate).getDate() + 1 > 2)) {
                    setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} n'a que 1 jour permission restant pour ce mois`);
                    setTimeout(() => {
                        setError("");
                    },7000)
                    return;
                }
                //
                if (nb === 1 && duration > 2 && (lastDateOfMonth(startDate).getDate() - formatDate(startDate).getDate() + 1 > 1)) {
                    setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} n'a que 2 jours permissions restants pour ce mois`);
                    setTimeout(() => {
                        setError("");
                    },7000)
                    return;
                }
            }
            // No more permissions 
            if ((selectedPerson.id_type_personnel === 2 && selectedPerson.nb_jours_conges + total_lasts_days === 28) || (selectedPerson.id_type_personnel === 1 && selectedPerson.nb_jours_conges + total_lasts_days === 40)) {
                setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} n'a plus de jours de permissions`);
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
            // take over between the endDate and the startDate if the endDate is on the next month range and set it for the next month
            if (formatDate(lastDateOfMonth(startDate)).getDate() - formatDate(startDate).getDate() >= 0 && formatDate(lastDateOfMonth(startDate)).getDate() - formatDate(startDate).getDate() <= 2) {
                nbDayPermCurrMonth.month = formatDate(startDate).getMonth();
                nbDayPermCurrMonth.amount = lastDateOfMonth(startDate).getDate() - formatDate(startDate).getDate() + 1;
                console.log(`number days using in the current month : ${nbDayPermCurrMonth.amount}`);
                console.log(`current month : ${nbDayPermCurrMonth.month}`);
                let next_month_date = new Date();
                next_month_date.setMonth(formatDate(startDate).getMonth() + 1);
                setDuration(nbDayPermCurrMonth.amount);
                if (dateInRange(formatDate(endDate), firstDateOfMonth(next_month_date), lastDateOfMonth(next_month_date))) {
                    nextMonthPermNb.month = next_month_date.getMonth();
                    nextMonthPermNb.amount = formatDate(endDate).getDate() - firstDateOfMonth(next_month_date).getDate() + 1;
                    console.log(`number days left for the next month : ${nextMonthPermNb.amount}`);
                    console.log(`next month : ${nextMonthPermNb.month}`);
                    console.log(`startDate month : ${formatDate(startDate).getMonth()}`);
                }
                if (nb === 3) {
                    setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a déja pris 3 jours de permissions le mois de ${monthToText(formatDate(startDate).getMonth())}`);
                    setTimeout(() => {
                        setError("");
                    },7000)
                    return;
                }
            }
            //
            if ( formatDate(startDate).getMonth() === selectedPerson.next_month_permission.month && selectedPerson.next_month_permission.amount !== 0 && duration > selectedPerson.next_month_permission.amount) {
                setError(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} n'a droit qu'à ${3 - selectedPerson.next_month_permission.amount} ${3 - selectedPerson.next_month_permission.amount > 1 ? "jours" : "jour"} de permission pour ce mois`);
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
            //
            if (duration > 3) {
                setError("On ne peut définir que 3 jours de permissions pour un personnel par mois");
                setTimeout(() => {
                  setError("");
                },7000)
                return;
            }
            //
            if (name === "" || startDate === "" || endDate === "" || duration === "" || repDate === "" || matricule === "" || type === "" || structure === "" || poste === "") {
                setError('Veuillez remplir tous les champs');
                setTimeout(() => {
                    setError("");
                }, 7000)
                return;
            } else {
                const attestation = {
                    name: name,
                    matricule: matricule,
                    sexe: sexe,
                    poste: poste.replace("'", "`"), 
                    type: type, 
                    duration: duration,
                    structure: structure.replace("'", "`"),
                    startDate: (formatDate(startDate).getDate() < 10 ? "0"+formatDate(startDate).getDate() : formatDate(startDate).getDate()) + "/" + (parseInt(formatDate(startDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(startDate).getMonth()+1) : parseInt(formatDate(startDate).getMonth()+1)) +"/"+formatDate(startDate).getFullYear(),
                    endDate: (formatDate(endDate).getDate() < 10 ? "0"+formatDate(endDate).getDate() : formatDate(endDate).getDate()) + "/" + (parseInt(formatDate(endDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(endDate).getMonth()+1) : parseInt(formatDate(endDate).getMonth()+1)) +"/"+formatDate(endDate).getFullYear(),
                    repriseDate: (formatDate(repDate).getDate() < 10 ? "0"+formatDate(repDate).getDate() : formatDate(repDate).getDate()) + "/" + (parseInt(formatDate(repDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(repDate).getMonth()+1) : parseInt(formatDate(repDate).getMonth()+1)) +"/"+formatDate(repDate).getFullYear(),
                    preposition: preposition,
                    grade : grade.replace("'", "`"),
                    created_at : new Date().toISOString().slice(0,19).replace('T',' ')
                }
                const next_month_permission = {
                    month : nextMonthPermNb.month,
                    amout : nextMonthPermNb.amount,
                }
                const permission_data = {
                    startDate : startDate,
                    endDate : endDate,
                    duration : duration,
                    id_personnel: selectedPerson.id_personnel,
                    curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
                    demande : demande,
                    document : document,
                    statut_permission : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en cours" : curr_date.toISOString().slice(0,19).replace('T',' ') >= endDate ? "terminé" : "pogrammé",
                    statut_attestation_permission : "non archivé"
                }
                let duree = nextMonthPermNb.amount > 0 ? duration - nextMonthPermNb.amount : duration
                const req_permission = `INSERT INTO permission 
                  (date_debut_permission, date_fin_permission, duree_permission, created_at_permission,attestation_permission,id_personnel,demande_permission,statut_permission,statut_attestation_permission) 
                  VALUES ("${permission_data.startDate}","${permission_data.endDate}",${duree},"${permission_data.curr_date}",'${JSON.stringify(attestation)}',${permission_data.id_personnel},"${permission_data.demande}","${permission_data.statut_permission}","${permission_data.statut_attestation_permission}");`;
                const statut = curr_date >= permission_data.startDate && curr_date <= permission_data.endDate ? "en permission" : "en poste";
                const req_pers = `UPDATE personnel SET next_month_permission = '${JSON.stringify(next_month_permission)}',statut_personnel = "${statut}",nb_jours_permission = (nb_jours_permission - ${duration}) WHERE id_personnel = ${permission_data.id_personnel};`;
                console.log(`permission query : ${req_permission}`);
                console.log(`personnel query : ${req_pers}`);
                /*window.electronAPI.addPermission(req_permission);
                setStatus(`Le satut de ${sexe === 'M' ? 'M.' : 'Mme'} ${name} a été mis à jour !`);
                window.electronAPI.permissionAddedSuccess(() => {
                    setSuccess("permission ajoutée avec succès");
                    setTimeout(() => {
                        setSuccess("");
                    }, 3000)
                });
                window.electronAPI.updatePersonnel(req_pers);
                window.electronAPI.updatePersonnelSuccess(() => {
                    console.log("personnel updated");
                });*/
                if (selectedPerson.id_type_personnel === 2 && total_lasts_days + parseInt(duration) > 10 && selectedPerson.nb_jours_conges > 0) {
                    let diff = selectedPerson.nb_jours_permission + 1 === 10 ? (total_lasts_days + parseInt(duration)) - 10 : (total_lasts_days + parseInt(duration)) - selectedPerson.nb_jours_permission ;
                    const req_personnel = `UPDATE personnel SET nb_jours_permission = 10,nb_jours_conges = (nb_jours_conges - ${diff}) WHERE id_personnel = ${selectedPerson.id_personnel};`;
                    console.log(`${req_personnel}`)
                    /*window.electronAPI.updatePersonnel(req_personnel);
                    window.electronAPI.updatePersonnelSuccess(() => {
                        setSuccess("personnel mis à jour avec succès");
                        setTimeout(() => {
                            setSuccess("");
                        }, 3000)
                    })*/
                }
                if (selectedPerson.id_type_personnel === 1 && total_lasts_days + parseInt(duration) > 10 && selectedPerson.nb_jours_conges > 0) {
                    let diff = selectedPerson.nb_jours_permission + 1 === 10 ? (total_lasts_days + parseInt(duration)) - 10 : (total_lasts_days + parseInt(duration)) - selectedPerson.nb_jours_permission ;
                    const req_personnel = `UPDATE personnel SET nb_jours_permission = 10,nb_jours_conges = (nb_jours_conges - ${diff}) WHERE id_personnel = ${selectedPerson.id_personnel};`;
                    console.log(`${req_personnel}`)
                    /*window.electronAPI.updatePersonnel(req_personnel);
                    window.electronAPI.updatePersonnelSuccess(() => {
                        setSuccess("personnel mis à jour avec succès");
                        setTimeout(() => {
                            setSuccess("");
                        }, 3000)
                    })*/
                }
                handleRefresh();
                setLoadingSpinner(true);
                setTimeout(() => 
                    setLoadingSpinner(false)
                , 3000);
                setActived(true);
            }
        } catch (error) {
            console.error("Erreur saving permission : " + error.message);
        }
    } 
    
    /** useeffect for fetching */
    useEffect(() => {
        fetchDatas();
    }, []);

    /** useEffect for updating specific data */
    useEffect(() => {
        const updatePersonnelState = async () => {
            try {
              //const statut = curr_date >= conge_data.startDate && curr_date <= conge_data.endDate ? "en congé" : "en poste";
                if (permission.length > 0) {
                    let date = new Date();
                    for (let x = 0; x < permission.length; x++) {
                        permission[x].attestation_permission = JSON.parse(permission[x].attestation_permission)
                        formatDate(permission[x].date_fin_permission);
                        permission[x].date_fin_permission.setDate(permission[x].date_fin_permission.getDate());
                        /*console.log(`conge : ${x}`);
                        console.log(`=========================================`);
                        console.log(`date : ${date}`)
                        console.log(`date dfp : ${permission[x].date_fin_permission}`);
                        console.log(`attesttaion repdate : ${permission[x].attestation_permission.repriseDate}`);
                        console.log(`=========================================`); */
                        if (date >= permission[x].date_debut_permission && (date <= permission[x].date_fin_permission)) {
                          const statut = "en permission";
                          const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${permission[x].id_personnel};`;
                          window.electronAPI.updatePersonnel(req_personnel);
                          console.log("le statut du personnel a été mis à jour");
                        }
                        if ((date.getDate() === permission[x].date_fin_permission.getDate() && date.getMonth() === permission[x].date_fin_permission.getMonth() && date.getFullYear() === permission[x].date_fin_permission.getFullYear()) || (date.getDate() > permission[x].date_fin_permission.getDate() && date.getMonth() === permission[x].date_fin_permission.getMonth() && date.getFullYear() === permission[x].date_fin_permission.getFullYear())) {
                          const req_permission = `UPDATE permission SET statut_permission = "terminé" WHERE id_permission = ${permission[x].id_permission}`;
                          window.electronAPI.addPermission(req_permission);
                          setSuccess(`La permission de ${permission[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${permission[x].nom_prenom_personnel} a été actualisé`);
                          //setStatus(`Le satut de la permission de ${permission[x].sexe_personnel === 'M' ? 'M.' : 'Mme'} ${permission[x].nom_prenom_personnel} a été mis à jour !`);  
                          setTimeout(() => {
                            setSuccess("");
                          }, 3000)
                        }
                        if (date.getDate() === new Date(permission[0].attestation_permission.repriseDate).getDate() && date.getMonth() === new Date(permission[0].attestation_permission.repriseDate).getMonth() && date.getFullYear() === new Date(permission[0].attestation_permission.repriseDate).getFullYear()) {
                          const req_personnel = `UPDATE personnel SET statut_personnel = "en poste" WHERE id_personnel = ${permission[x].id_personnel};`;
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
    }, [permission]);

    // select current user conges & permissions
    useEffect(() => {
        const func = async () => {
            try {
                const test_conge_req = `SELECT * FROM conge WHERE id_personnel = ${id_personnel}`;
                window.electronAPI.getSpecificConge(test_conge_req);
                await window.electronAPI.retrieveSpecificConge((event, res) => {       
                    for (let index = 0; index < res.length; index++) {
                        res[index].attestation_conge = JSON.parse(res[index].attestation_conge)
                    }
                    setUserConge(res);
                })
                const last_permission_req = `SELECT * FROM permission WHERE id_personnel = ${id_personnel}`;
                window.electronAPI.getLastPermission(last_permission_req);
                await window.electronAPI.retrieveLastPermission((event, res) => {        
                    for (let index = 0; index < res.length; index++) {
                        res[index].attestation_permission = JSON.parse(res[index].attestation_permission)                                                
                    }
                    setLastPermission(res);
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, [id_personnel])

    const handleRefresh = () => {
        try {
          setLoadingSpinner(true);
          setTimeout(() => 
          setLoadingSpinner(false)
          , 3000);
          fetchDatas();
          console.log("datas refreshed successfully");
        } catch (err) {
          console.error("error on refresh : " + err.message);
        }
    }

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Tableaux de Conges */}
            <Row>
                <Col lg="12">
                <Card>
                    <CardHeader>
                    <Row>
                        <Col lg="6">
                        <Input
                            type="select"
                            className="form-control mt-2"
                            onChange={handleStatutFilter}
                            value={statutFilter}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="programmé">programmé</option>
                            <option value="en cours">en cours</option>
                            <option value="terminé">terminé</option>
                        </Input>
                        </Col>
                        <Col lg="6">
                        <Input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Rechercher par nom ou matricule"
                            onChange={handleSearch}
                            value={search}
                        />
                        </Col>
                    </Row>
                    </CardHeader>
                </Card>
                </Col>
                <div className="col p-0">
                    <div className="col">
                        <Card className="shadow">
                            <Row>
                                <Col lg="12">
                                    { success && 
                                        <Alert className="text-center" color="success">
                                            {success}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            <CardHeader className="bg-white border-2 d-flex justify-content-center">
                                <h3 className="mb-0 text-center">Listes des Permissions</h3>
                                <Button
                                    size="sm"
                                    className="ml-3"
                                    onClick={() => handleRefresh()}
                                    >
                                    Actualiser
                                </Button>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th>Matricule</th>
                                        <th>Nom</th>
                                        <th>Date de debut</th>
                                        <th>Date de fin</th>
                                        <th>Nombre de jours restant</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingSpinner && (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {filterPermission && filterPermission.length > 0 ? !loadingSpinner && (filterPermission.slice(offset, offset + perPage).map((p, index) => (
                                        <tr key={index}>
                                            <td>{p.matricule_personnel}</td>    
                                            <td>{p.nom_prenom_personnel}</td>    
                                            <td>{p.date_debut_permission.getDate() + "/" + (parseInt(p.date_debut_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_debut_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "/" + p.date_debut_permission.getFullYear()}</td>
                                            <td>{p.date_fin_permission.getDate() + "/" + (parseInt(p.date_fin_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_fin_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "/" + p.date_fin_permission.getFullYear()}</td>
                                            <td>{p.statut_permission !== "terminé" ? curr_date >= p.date_debut_permission && curr_date <= p.date_fin_permission ? Math.ceil((p.date_fin_permission - curr_date) / (1000 * 3600 * 24)) : Math.ceil((p.date_fin_permission - p.date_debut_permission)/ (1000 * 3600 * 24) + 1) : 0 }</td>
                                            <td>{p.statut_permission === "en cours"
                                                ? <Badge color="success">
                                                    {p.statut_permission}
                                                </Badge>
                                                : 
                                                    p.statut_permission === "terminé"
                                                ?
                                                    <Badge color="primary">
                                                        {p.statut_permission}
                                                    </Badge>
                                                :
                                                    <Badge color="warning">
                                                        {p.statut_permission}
                                                    </Badge>
                                                }
                                            </td>
                                            <td className="text-right">
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                    className="btn-icon-only text-light"
                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={(e) => e.preventDefault()}
                                                    >
                                                        <i className="fas fa-ellipsis-v" />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem
                                                            onClick={() => saveAttestationRepPermission(p)}
                                                            disabled={p.statut_permission === "terminé" ? false : true}
                                                        >
                                                            Générer l'attestation de reprise
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    ))) :             
                                        !loadingSpinner && (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    {loadingText}
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </Table>
                            <Row className="m-0 justify-content-center">
                                <CardFooter className="py-3 d-flex" >
                                    <nav className="ligna-items-center" aria-label="...">
                                        <Pagination
                                        className="pagination justify-content-center"
                                        listClassName="justify-content-center"
                                        >
                                        <PaginationItem>
                                            <PaginationLink
                                            onClick={() => handlePagePrev()}
                                            tabIndex="-1"
                                            >
                                            <i className="fas fa-angle-left" />
                                            <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                            {Array.from({length: pageCount}, (_, i) => (
                                                <PaginationItem key={i} active={i === pageNumber}>
                                                    <PaginationLink onClick={() => handlePageChange({selected: i})}>
                                                        {i}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        <PaginationItem>
                                            <PaginationLink
                                            onClick={() => handlePageNext()}
                                            >
                                            <i className="fas fa-angle-right" />
                                            <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        </Pagination>
                                    </nav>
                                </CardFooter>
                            </Row>
                        </Card>
                    </div>
                </div>
            </Row>
            {/** Fomulaire de création de permission */}
            <Row className="mt-5">
                    <Col className="order-xl-1" md="12" lg="12">
                        <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                                <Col xs="8">
                                    <h3 className="mb-0">Définir une nouvelle Permission</h3>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                            <Col md="12">
                                { status && 
                                <Alert color="dark" isOpen={visible} toggle={onDismiss}>
                                    {status}
                                </Alert>
                                }
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Form>
                            <h6 className="heading-small text-muted mb-4">
                                Information du personnel
                            </h6>
                            <div className="pl-lg-4">
                                <Row>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-username"
                                    >
                                        Nom 
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-username"
                                        defaultValue={name}
                                        onChange={handleInputChange(setName)}
                                        placeholder="Nom "
                                        type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-phone"
                                    >
                                        Telephone
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-phone"
                                        defaultValue={telephone}
                                        onChange={handleInputChange(setTelephone)}
                                        placeholder=""
                                        type="phone"
                                    />
                                    </FormGroup>
                                </Col>
                                </Row>
                                <Row>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-matricule"
                                    >
                                        Matricule
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-matricule"
                                        defaultValue={matricule}
                                        onChange={handleInputChange(setMatricule)}
                                        placeholder="Matricule"
                                        type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-poste"
                                    >
                                        Poste
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        defaultValue={poste}
                                        onChange={handleInputChange(setPoste)}
                                        id="input-poste"
                                        placeholder="poste"
                                        type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                </Row>
                                <Row>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-type"
                                    >
                                        Type
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        defaultValue={type}
                                        id="input-type"
                                        onChange={handleInputChange(setType)}
                                        placeholder="type personnel"
                                        type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-structure"
                                    >
                                        Structure
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        defaultValue={structure}
                                        id="input-structure"
                                        onChange={handleInputChange(setStructure)}
                                        placeholder="structure de travail"
                                        type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                </Row>
                            </div>
                            <hr className="my-4" />
                            {/* Congés */}
                            <h6 className="heading-small text-muted mb-4">
                                Information sur la permission
                            </h6>
                            <div className="pl-lg-4">
                                <Row>
                                    <Col md="12">  
                                        <FormGroup>
                                            <Label
                                                for="demande-file"
                                            >
                                                Demande de Permision Timbré
                                            </Label>
                                            <Input
                                                id="demande-file"
                                                name="file"
                                                type="file"
                                                accept=".jpeg, .png, .jpg"
                                                onChange={handleFileChange(setDemande)}
                                            />
                                            <FormText>
                                                selectionner la demande (fichier accepté .jpeg, .png, .jpg)
                                            </FormText>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label for="date-depart">
                                            Date de départ
                                        </Label>
                                        <Input
                                            id="date-depart"
                                            name="date"
                                            onChange={handleInputChange(setStartDate)}
                                            defaultValue={startDate}
                                            placeholder="date"
                                            type="date"
                                        />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label for="duree">
                                            {"Durée (en jours)"}
                                        </Label>
                                        <Input
                                            id="duree"
                                            defaultValue={duration}
                                            onChange={handleInputChange(setDuration)}
                                            //onChange={(e) => handleChangeDuration(e)}
                                            name="datetitme"
                                            placeholder="duree en jours"
                                            type="number"
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label for="date-fin">
                                            Date de fin
                                        </Label>
                                        <Input
                                            id="date-fin"
                                            name="end-date"
                                            value={endDate}
                                            placeholder="date"
                                            type="date"
                                            readOnly
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        { error && 
                                            <Alert color="danger">
                                                {error}
                                            </Alert>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Button
                                            color="primary"
                                            onClick={(e) => savePermission(e)}
                                            disabled={actived}
                                        >
                                            Générer l'attestation
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                            </Form>
                        </CardBody>
                        </Card>
                    </Col>
            </Row>
        </Container>
      </>
    );
}

export default Permission;