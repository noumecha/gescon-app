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
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Conges = () => {
  const location = useLocation();
  /** recuperation des attributs d'un personnel depuis personnel.js */
  const { selectedPerson } = location.state || {};
  //const [decision, setDecision] = useState([]);
  const [userConge, setUserConge] = useState([]);
  const [typeConge, setTypeConge] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repriseDate, setRepriseDate] = useState("");
  const [selectedType, setSelectedType] = useState(typeConge.length > 0 ? typeConge[0].libelle_type_conge : "congé administratif partiel");
  const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
  const preposition = selectedPerson ? selectedPerson.preposition_personnel : "au";
  const grade = selectedPerson ? selectedPerson.grade_personnel : "GRADE";
  const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
  const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
  const [selectedDec, setSelectedDec] = useState("");
  const [struc, setStruc] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
  const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
  const sexe = selectedPerson ? selectedPerson.sexe_personnel : "M.";
  const nb_jours_conges = selectedPerson ? selectedPerson.nb_jours_conges : 0;
  const [telephone, setTelphone] = useState(selectedPerson ? selectedPerson.telephone_personnel : 696879475);
  const [demande, setDemande] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState("");
  const [status, setStatus] = useState(`${sexe === 'M' ? 'M.' : 'Mme'} ${name} a ${nb_jours_conges} ${nb_jours_conges > 1 ? "jours" : "jour"} de congés disponibles`);
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
  const [duration, setDuration] = useState(selectedPerson ? selectedPerson.nb_jours_conges : "");
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

  const fetchDatas = async () => {
    try {
      window.electronAPI.getConge();
      await window.electronAPI.retrieveConge((event, res) => {
        setConge(res);
        setTimeout(() => 
        setLoadingSpinner(false)
        , 3000);
      })
      window.electronAPI.getSpecificDec(selectedPerson ? selectedPerson.id_type_personnel : 1);
      await window.electronAPI.retrieveSpecificDec((event, res) => {
        const specific_dec = res;
        setSelectedDec(specific_dec[0].numero_decision);
      })
      window.electronAPI.getCongeType();
      await window.electronAPI.retrieveCongeType((event, res) => {
        setTypeConge(res);
      })
    } catch (error) {
        console.error("Erreur : " + error.message);
    }
  }

  const saveConge = async (e) => {
    e.preventDefault();
    try {
      if (duration <= 0) {
        setError(`La durée du congé ne peut pas etre négative ou égale à 0`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedPerson.id_type_personnel === 2) {
        if (duration > selectedPerson.nb_jours_conges && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
      }
      if (formatDate(startDate).getDay() === 0 || formatDate(startDate).getDay() === 6) {
        setError("Le congé ne peut etre configurer que pour les jours ouvrables");
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (selectedPerson.id_type_personnel === 1) {
        if (duration > selectedPerson.nb_jours_conges && (selectedType === "congé administratif partiel" || selectedType === "congé administratif total")) {
          setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
          setTimeout(() => {
            setError("");
          },7000)
          return;
        }
      }
      if ((selectedPerson.id_type_personnel === 1 && selectedPerson.nb_jours_conges === 0) && (selectedType !== "congé maladie" || selectedType !== "congé maternité")) {
        setError(`${sexe === 'M' ? 'M' : 'Mme'} ${name} a déja epuisé tout ces congés pour l'année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if ((selectedPerson.id_type_personnel === 2 && selectedPerson.nb_jours_conges === 0) && (selectedType !== "congé maladie" || selectedType !== "congé maternité")) {
        setError(`${sexe === 'M' ? 'M' : 'Mme'} ${name} a déja epuisé tout ces congés pour l'année`);
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (typeConge === "" || name === "" || startDate === "" || endDate === "" || duration === "" || repriseDate === "" || selectedType === "" || matricule === "" || type === "" || selectedDec === "" || struc === "" || poste === "") {
        setError('Veuillez remplir tous les champs');
        setTimeout(() => {
          setError("");
        }, 7000)
        return;
      }
      if (formatDate(startDate).getFullYear() !== curr_date.getFullYear()) {
        //console.log(`3`);
        setError(`Impossible de définir un congé pour une année ultérieure ou antérieure`);
        setTimeout(() => {
            setError("");
        },7000)
        return;
      }
      if (userConge.length > 0) {
        for (let index = 0; index < userConge.length; index++) {
            nbDaysConges += nbDaysBetween(formatDate(userConge[index].date_debut_conge),formatDate(userConge[index].date_fin_conge)) + 1;
            if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) && (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
              //console.log(`1`);
              setError(`Impossible de définir un congé pour cette date car ${sexe === 'M' ? 'M' : 'Mme'} ${name} a déja un congé prévu`);
              setTimeout(() => {
                  setError("");
              },7000)
              return;
            }
            if ((formatDate(startDate) >= formatDate(userConge[index].date_debut_conge) && formatDate(startDate) <= formatDate(userConge[index].date_fin_conge)) || (formatDate(endDate) >= formatDate(userConge[index].date_debut_conge)  && formatDate(endDate) <= formatDate(userConge[index].date_fin_conge))) {
              //console.log(`2`);  
              setError(`Impossible de définir un congé pour cette date car ${sexe === 'M' ? 'M' : 'Mme'} ${name} a déja pris un congé`);
              setTimeout(() => {
                  setError("");
              },7000)
              return;
            }
            if (formatDate(startDate) === formatDate(userConge[index].attestation_conge.date_debut_conge)) {
              //console.log(`3`);
              setError(`Impossible de définir un congé pour cette date car ${sexe === 'M' ? 'M' : 'Mme'} ${name} a un congé prévu cette meme date`);
              setTimeout(() => {
                  setError("");
              },7000)
              return;
            }
            if (formatDate(startDate) === formatDate(userConge[index].date_debut_conge)) {
              //console.log(`3`);
              setError(`Impossible de définir un congé pour cette date car ${sexe === 'M' ? 'M' : 'Mme'} ${name} a un congé prévu cette meme date`);
              setTimeout(() => {
                  setError("");
              },7000)
              return;
            }

        }
      }
      const attestation = {
        name: name,
        matricule: matricule,
        sexe: sexe,
        poste: poste.replace("'", "`"), 
        type: type,
        decision: selectedDec, 
        duration: duration,
        structure: struc.replace("'", "`"),
        startDate: (formatDate(startDate).getDate() < 10 ? "0"+formatDate(startDate).getDate() : formatDate(startDate).getDate()) + "/" + (parseInt(formatDate(startDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(startDate).getMonth()+1) : parseInt(formatDate(startDate).getMonth()+1)) +"/"+formatDate(startDate).getFullYear(),
        endDate: (formatDate(endDate).getDate() < 10 ? "0"+formatDate(endDate).getDate() : formatDate(endDate).getDate()) + "/" + (parseInt(formatDate(endDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(endDate).getMonth()+1) : parseInt(formatDate(endDate).getMonth()+1)) +"/"+formatDate(endDate).getFullYear(),
        repriseDate: (formatDate(repriseDate).getDate() < 10 ? "0"+formatDate(repriseDate).getDate() : formatDate(repriseDate).getDate()) + "/" + (parseInt(formatDate(repriseDate).getMonth()+1) < 10 ? "0"+parseInt(formatDate(repriseDate).getMonth()+1) : parseInt(formatDate(repriseDate).getMonth()+1)) +"/"+formatDate(repriseDate).getFullYear(),
        typeConge: selectedType,
        preposition: preposition,
        grade : grade,
      }
      const conge_data = {
        startDate : startDate,
        endDate : endDate,
        duration : duration,
        id_personnel: selectedPerson.id_personnel,
        curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
        demande : demande,
        document : document,
        id_type_conge : selectedType === "congé administratif partiel" ? 1 : selectedType === "congé administratif total" ? 2 : selectedType === "congé maternité" ? 3 : selectedType === "congé maladie" ? 4 : 0,
        statut_attestation_conge : "non archivé",
        statut_conge : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en cours" : curr_date.toISOString().slice(0,19).replace('T',' ') >= endDate ? "terminé" : "programmé",
        statut_personnel : curr_date.toISOString().slice(0,19).replace('T',' ') >= startDate && curr_date.toISOString().slice(0,19).replace('T',' ') <= endDate ? "en congé" : "en poste",
      }
      const req_conge = `INSERT INTO conge 
        (date_debut_conge, date_fin_conge, duree_conge, created_at_conge,attestation_conge,id_type_conge,id_personnel,demande_conge,statut_conge,statut_attestation_conge,document_a_fournir) 
        VALUES ("${conge_data.startDate}","${conge_data.endDate}",${conge_data.duration},"${conge_data.curr_date}",'${JSON.stringify(attestation)}',${conge_data.id_type_conge},${conge_data.id_personnel},"${conge_data.demandeFile}","${conge_data.statut_conge}","${conge_data.statut_attestation_conge}","${conge_data.document}");`;
      const req_personnel = `UPDATE personnel SET ${selectedType === "congé maternité" ? `(nb_jours_conges_maternite = nb_jours_conges_maternite - ${duration})` : selectedType === "congé maladie" ? `nb_jours_conges_maladie = (nb_jours_conges_maladie - ${duration})` : `nb_jours_conges = (nb_jours_conges - ${duration})`} WHERE id_personnel = ${conge_data.id_personnel};`;
      console.log(req_personnel);
      /*window.electronAPI.addConge(req_conge);
      window.electronAPI.updatePersonnel(req_personnel);
      window.electronAPI.congeAddedSuccess(() => { 
        setSuccess("congé ajouté avec succès");
        setStatus(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
      });
      setTimeout(() => {
        setSuccess("");
      }, 3000)
      setActived(true);*/
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
      }
      const created_at_att_rep_conge = new Date().toISOString().slice(0,19).replace('T',' ');
      const req = `UPDATE conge SET created_at_reprise_service = "${created_at_att_rep_conge}",attestation_reprise_service='${JSON.stringify(attestation_reprise)}',statut_att_rep_conge="non archivé" WHERE ${c.id_conge}=conge.id_conge`; 
      window.electronAPI.addArchiveAttestationRepConge(req);
      await window.electronAPI.addArchiveAttCongeRepSuccess((event, res) => {
        setGenerateSuccess("Attestation de reprise générer avec succès");
        console.log(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
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

  function nbDaysBetween(start, end) {
    return parseInt(Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  }

  // useEffect for calculate the end conge date base on the start date and duration
  useEffect(() => {
    const changeDuration = () => {
      if (selectedType === "congé maternité" && selectedPerson.sexe_personnel !== "M") {
        setDuration("98");
      }
      if (selectedType === "congé maladie") {
        setDuration("90");
      }
    };
    const calculateEndDate = () => {
      if (startDate && duration) {
        if (selectedPerson.id_type_personnel === 2 && (selectedType === "congé administratif total" || selectedType === "congé administratif partiel")) {
          let st = new Date(startDate);
          let weekdaysToAdd = duration - 1;
          while (weekdaysToAdd > 0) {
            st.setDate(st.getDate() + parseInt(1));
            if (st.getDay() !== 0 && st.getDay() !== 6) {
              weekdaysToAdd--;
            }
          }
          console.log('end date : ' + st);
          let next_day = new Date();
          let rep = new Date();
          next_day.setDate(st.getDate() + 1);
          if (next_day.getDay() === 0 || next_day.getDay() === 6) {
            rep.setDate(st.getDate() + 3);
            console.log("rep date : " + rep);
          } else {
            rep.setDate(st.getDate() + 1);
            console.log("rep date : " + rep);
          }
          setEndDate(st.toISOString().split("T")[0]);
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
          conge[x].attestation_conge = JSON.parse(conge[x].attestation_conge)
          formatDate(conge[0].date_fin_conge);
          conge[0].date_fin_conge.setDate(conge[0].date_fin_conge.getDate());
          //console.log(`date : ${date.getMonth()}`)
          /*console.log(`date dfc : ${conge[0].date_fin_conge.getDate()}`);
          console.log(`attesttaion : ${new Date(conge[0].attestation_conge.repriseDate).getMonth()}`);*/
          if (date >= conge[x].date_debut_conge && date <= conge[x].date_fin_conge) {
            const statut = "en congé";
            const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}" WHERE id_personnel = ${conge[x].id_personnel};`;
            window.electronAPI.updatePersonnel(req_personnel);
            console.log("le statut du personnel a été mis à jour");
          }
          if ((date.getDate() === conge[x].date_fin_conge.getDate() && date.getMonth() === conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear()) || (date.getDate() > conge[x].date_fin_conge.getDate() && date.getMonth() === conge[x].date_fin_conge.getMonth() && date.getFullYear() === conge[x].date_fin_conge.getFullYear())) {
            const statut_conge = "terminé";
            const req_conge = `UPDATE conge SET statut_conge = "${statut_conge}" WHERE id_conge = ${conge[x].id_conge}`;
            window.electronAPI.addConge(req_conge);
            console.log(`Le congé de ${conge[x].sexe_personnel === 'M' ? 'M' : 'Mme'} ${conge[x].nom_prenom_personnel} a été actualisé`);
            console.log(`Le satut du congé de ${conge[x].sexe_personnel === 'M' ? 'M' : 'Mme'} ${conge[x].nom_prenom_personnel} a été mis à jour !`);  
            setTimeout(() => {
              setSuccess("");
            }, 3000)
          }
          if (date.getDate() === new Date(conge[0].attestation_conge.repriseDate).getDate() && date.getMonth() === new Date(conge[0].attestation_conge.repriseDate).getMonth() && date.getFullYear() === new Date(conge[0].attestation_conge.repriseDate).getFullYear()) {
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
    fetchDatas();
  },[]);

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
          <Col lg="12">
            <Card className="shadow">
              <Row>
                <Col md="12" className="text-center">
                  {/* generateError && 
                    <Alert color="danger">
                      {generateError}
                    </Alert>
                  */}
                  { generateSuccess && 
                    <Alert color="success">
                      {generateSuccess}
                    </Alert>
                  }
                </Col>
              </Row>
              <CardHeader className="bg-white border-2 d-flex justify-content-center">
                <h3 className="mb-0 text-center">Listes des Congés</h3>
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
                      {filterConge && filterConge.length > 0 ? !loadingSpinner && (filterConge.slice(offset, offset + perPage).map((c, index) => (
                          <tr key={index}>
                              <td>{c.matricule_personnel}</td>    
                              <td>{c.nom_prenom_personnel}</td> 
                              <td>{c.date_debut_conge.getDate() + "/" + (parseInt(c.date_debut_conge.getMonth()+1) <= 9 ? "0"+parseInt(c.date_debut_conge.getMonth()+1) : parseInt(c.date_fin_conge.getMonth()+1)) + "/" + c.date_debut_conge.getFullYear() }</td>
                              <td>{c.date_fin_conge.getDate() + "/" + (parseInt(c.date_fin_conge.getMonth()+1) <= 9 ? "0"+parseInt(c.date_fin_conge.getMonth()+1) : parseInt(c.date_fin_conge.getMonth()+1)) + "/" + c.date_fin_conge.getFullYear()}</td>
                              <td>{c.statut_conge === "programmé" ? c.attestation_conge.duration : c.statut_conge !== "terminé" ? curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge ? Math.ceil((c.date_fin_conge - curr_date) / (1000 * 3600 * 24)) : Math.ceil((c.date_fin_conge - c.date_debut_conge)/ (1000 * 3600 * 24)) : 0 }</td>
                              <td>{c.statut_conge === "en cours"
                                  ? <Badge color="success">
                                      {c.statut_conge}
                                    </Badge>
                                  : 
                                  c.statut_conge === "terminé"
                                  ?
                                    <Badge color="primary">
                                      {c.statut_conge}
                                    </Badge>
                                  :
                                    <Badge color="warning">
                                      {c.statut_conge}
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
                                            onClick={() => saveAttestationRepConge(c)}
                                            disabled={c.statut_conge === "terminé" ? false : true}
                                          >
                                            Générer l'attestation de reprise
                                          </DropdownItem>
                                      </DropdownMenu>
                                  </UncontrolledDropdown>
                              </td>
                          </tr>
                      )))
                      :
                        !loadingSpinner && (
                          <tr>
                            <td colSpan="7" className="text-center">
                              {loadingText}
                            </td>
                          </tr>
                        )
                      }
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
          </Col>
        </Row>
        {/** Formulaire de Creation de Congé */}
        <Row className="mt-5">
          <Col className="order-xl-1" md="12" lg="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Définir un nouveau congé</h3>
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
                            value={name}
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
                            onChange={handleInputChange(setTelphone)}
                            value={telephone}
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
                            value={matricule}
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
                            value={poste}
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
                            value={type}
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
                            value={struc}
                            id="input-structure"
                            onChange={handleInputChange(setStruc)}
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
                    Information sur le congés
                  </h6>
                  <div className="pl-lg-4">
                  <Row>
                      <Col md="6">
                        <FormGroup>  
                          <Label for="type-conge">
                            Type de congé
                          </Label>              
                          <Input
                            className="mb-3"
                            type="select"
                            id="type-conge"
                            value={selectedType}
                            onChange={handleInputChange(setSelectedType)}
                          >
                            {typeConge && typeConge.length > 0 
                              ? typeConge.map((t, i) => (
                                <option key={i}>{t.libelle_type_conge}</option>
                              ))
                              : (<option>Selectionner le type de congé</option>)
                            }
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>  
                        <FormGroup>
                          <Label
                            for="demande-file"
                          >
                            Demande de Congé Timbré
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
                    {selectedType === "congé maladie" || selectedType === "congé maternité" ? (
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label
                              for="exampleFile"
                            >
                              Document
                            </Label>
                            <Input
                              id="exampleFile"
                              name="file"
                              type="file"
                              accept=".jpeg, .png, .jpg"
                              onChange={handleFileChange(setDocument)}
                            />
                            <FormText>
                              Pièces à fournir comme justificatif en fonction du type de congé (fichier accepté .jpeg, .png, .jpg)
                            </FormText>
                          </FormGroup>
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
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
                            value={startDate}
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
                            value={duration}
                            onChange={handleInputChange(setDuration)}
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
                              name="date"
                              value={endDate}
                              placeholder="date"
                              type="date"
                              readOnly
                            />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>  
                          <Label for="num-decision">
                            Numero de Décision
                          </Label>              
                          <Input
                            className="mb-3"
                            type="text"
                            id="num-decision"
                            value={selectedDec}
                            readOnly
                          >
                            {/*decision && decision.length > 0 
                              ? decision.map((d, i) => (
                                <option key={i}>{d.numero_decision}</option>
                              ))
                              : (<option>Selectionner le numero de décision</option>)
                            */}
                          </Input>
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
                        { success && 
                          <Alert color="success">
                            {success}
                          </Alert>
                        }
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="6">
                        <Button
                          color="primary"
                          onClick={(e) => saveConge(e)}
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
};

export default Conges;
