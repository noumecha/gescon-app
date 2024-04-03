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
  Badge
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import CongeDoc from "documents/CongeDoc";

const Conges = () => {
  const location = useLocation();
  /** recuperation des attributs d'un personnel depuis personnel.js */
  const { selectedPerson } = location.state || {};
  //const [decision, setDecision] = useState([]);
  const [typeConge, setTypeConge] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repriseDate, setRepriseDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
  const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
  const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
  const [selectedDec, setSelectedDec] = useState("nothing");
  const [struc, setStruc] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
  const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
  //const [sexe, setSexe] = useState(selectedPerson ? selectedPerson.sexe_personnel : "M");
  const sexe = selectedPerson ? selectedPerson.sexe_personnel : "M"
  const nb_jours_conges = selectedPerson ? selectedPerson.nb_jours_conges : 18
  const [telephone, setTelphone] = useState(selectedPerson ? selectedPerson.telephone_personnel : 696879475)
  const [demande, setDemande] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(`${sexe === 'M' ? 'M' : 'Mme'} ${name} à droit à ${nb_jours_conges} ${nb_jours_conges > 1 ? "jours" : "jour"} de congés`);
  const [visible, setVisible] = useState(true)
  //const [deleteSuccess, seDeleteSuccess] = useState("");
  const [conge, setConge] = useState([]);
  /*const [congeData, setCongeData] = useState({});
  const [attestationData, setAttestationData] = useState({});
  const [reqUpdateConge, setReqUpdateConge] = useState("");
  const [statutPersonnel, setStatutPersonnel] = useState("");
  const [reqPersonnel, setReqPersonnel] = useState("");
  const [stateUpdate, setStateUpdate] = useState(true);*/
  const curr_date = new Date();

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

  const saveConge = async (e) => {
    e.preventDefault();
    try {
      if (duration > nb_jours_conges) {
        setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
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
      } else {
        const attestation = {
          name: name,
          matricule: matricule,
          sexe: sexe,
          poste: poste.replace("'", "`"), 
          type: type,
          decision: selectedDec, 
          duration: duration,
          structure: struc.replace("'", "`"),
          startDate: startDate,
          endDate: endDate,
          repriseDate: repriseDate,
          typeConge: selectedType,
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
          statut_conge : "non archivé"
        }
        const req_conge = `INSERT INTO conge 
          (date_debut_conge, date_fin_conge, duree_conge, created_at_conge,attestation_conge,id_type_conge,id_personnel,demande_conge,statut_conge,document_a_fournir) 
          VALUES ("${conge_data.startDate}","${conge_data.endDate}",${conge_data.duration},"${conge_data.curr_date}",'${JSON.stringify(attestation)}',${conge_data.id_type_conge},${conge_data.id_personnel},"${conge_data.demandeFile}","${conge_data.statut_conge}","${conge_data.document}");`;
        const statut = curr_date >= conge_data.startDate && curr_date <= conge_data.endDate ? "en congé" : "en poste";
        const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}",nb_jours_conges = (nb_jours_conges - ${duration}) WHERE id_personnel = ${conge_data.id_personnel};`;
        window.electronAPI.addConge(req_conge);
        window.electronAPI.updatePersonnel(req_personnel);
        window.electronAPI.congeAddedSuccess(() => {
          setSuccess("congé ajouté avec succès");
          setStatus(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
        });
        setTimeout(() => {
            setSuccess("");
        }, 3000)
      }
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
  }

  const saveEditedConge = async (e) => {
    e.preventDefault();
    try {
      if (duration > nb_jours_conges) {
        setError("Vous ne pouvez pas dépassé le nombre de jours de congés disponible");
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (duration === 0) {
        setError(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} n'a pas droit au congé`);
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
      } else {
        /*window.electronAPI.addConge(reqUpdateConge);
        window.electronAPI.updatePersonnel(reqPersonnel);
        window.electronAPI.congeAddedSuccess(() => {
          setSuccess("congé mis à jour succès");
          setStatus(`Le statut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
        });
        setTimeout(() => {
          setSuccess("");
        }, 3000)
        console.log("test update sucessfully");*/
      } 
    } catch (err) {
      console.log("error on update conge : " + err.message);
    }
  }

  const editConge = async (c) => {
    console.log("you want to edit conge : ", c);
    //const d = c.id_type_personnel === 1 ? 30 : 18 ;
    //const reqP = `UPDATE personnel SET nb_jours_conges = ${d} WHERE id_personnel = ${c.id_personnel};`;
    //setReqPersonnel(`UPDATE personnel SET nb_jours_conges = ${d} WHERE id_personnel = ${c.id_personnel};`);
    //console.log("reqpersonnl : ", reqPersonnel);
    /*window.electronAPI.updatePersonnel(reqP);
    window.electronAPI.updatePersonnelSuccess(() => {
      setSuccess("nombres de jours de congés reinitialiser");
    });
    setTimeout(() => {
      setSuccess("");
    }, 3000)
    setStateUpdate(false)
    setStatus(`Modification des paramètres du congé de ${c.sexe_personnel === 'M' ? 'M' : 'Mme'} ${c.nom_prenom_personnel}`);
    setName(c.nom_prenom_personnel);
    setPoste(c.poste_personnel);
    setMatricule(c.matricule_personnel);
    setType(c.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" );
    setStruc(c.structure_personnel);
    setSexe(c.sexe_personnel);
    setTelphone(c.telephone_personnel);
    window.electronAPI.getSpecificCongeType(c.id_type_conge);
    await window.electronAPI.retrieveSpecificCongeType((event, res) => {
      const specific_conge_type = res;
      setSelectedType(specific_conge_type[0].libelle_type_conge);
    })
    const start = new Date(c.date_debut_conge.toISOString().split("T")[0]);
    start.setDate(start.getDate() + parseInt(1));
    setStartDate(start.toISOString().split("T")[0]);
    const end = new Date(c.date_debut_conge.toISOString().split("T")[0]);
    end.setDate(end.getDate() + parseInt(c.duree_conge));
    setEndDate(end.toISOString().split("T")[0]);
    const repDate = new Date(end);
    repDate.setDate(end.getDate() + parseInt(1));
    setRepriseDate(repDate.toISOString().split("T")[0]);
    setDuration(c.duree_conge);
    window.electronAPI.getSpecificDec(c.id_type_personnel);
    await window.electronAPI.retrieveSpecificDec((event, res) => {
      const specific_dec = res;
      setSelectedDec(specific_dec[0].numero_decision);
    })
    setAttestationData({
      name: name,
      matricule: matricule,
      sexe: sexe,
      poste: poste.replace("'", "`"), 
      type: type,
      decision: selectedDec, 
      duration: duration,
      structure: struc.replace("'", "`"),
      startDate: startDate,
      endDate: endDate,
      repriseDate: repriseDate,
      typeConge: selectedType,
    })
    setCongeData({
      startDate : startDate,
      endDate : endDate,
      duration : duration,
      id_personnel: c.id_personnel,
      curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
      demande : c.demande_conge ? c.demande_conge : demande,
      document : c.document_a_fournir ? c.document_a_fournir : document,
      id_type_conge : selectedType === "congé administratif partiel" ? 1 : selectedType === "congé administratif total" ? 2 : selectedType === "congé maternité" ? 3 : selectedType === "congé maladie" ? 4 : 0,
      statut_conge : c.statut_conge
    })
    setStatutPersonnel(curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge ? "en congé" : "en poste");
    setReqUpdateConge(`UPDATE conge 
    SET date_debut_conge = "${congeData.startDate}" ,
      date_fin_conge = "${congeData.endDate}",
      duree_conge = ${congeData.duration},
      updated_at_conge = "${congeData.curr_date}",
      attestation_conge = '${JSON.stringify(attestationData)}',
      id_type_conge = ${congeData.id_type_conge},
      demande_conge = "${congeData.demande}",
      document_a_fournir = "${congeData.document}"
    WHERE id_conge = ${c.id_conge}`);
    console.log("req update conge : " + reqUpdateConge)
    setReqPersonnel(`UPDATE personnel SET statut_personnel = "${statutPersonnel}",nb_jours_conges = (nb_jours_conges - ${congeData.duration}) WHERE id_personnel = ${congeData.id_personnel};`);
    */
  }

  const stopConge = (c) => {
    console.log("you want to stop conge : ", c);
  }

  const deleteConge = (c) => {
    console.log("You want to delete conge : ", c);
  }

  useEffect(() => {
    if (typeConge && typeConge.length > 0) {
      setSelectedType(typeConge[0].libelle_type_conge);
    }
    const calculateEndDate = () => {
      if (startDate && duration) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + parseInt(duration));
        setEndDate(end.toISOString().split("T")[0]);
        const repDate = new Date(end);
        repDate.setDate(end.getDate() + parseInt(1));
        setRepriseDate(repDate.toISOString().split("T")[0]);
      }
    };
    calculateEndDate();
  }, [startDate, duration,typeConge]);

  /** useEffect for common function and fetching */
  useEffect(() => {
    const func = async () => {
        try {
          window.electronAPI.getConge();
          await window.electronAPI.retrieveConge((event, res) => {
            setConge(res);
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
    func();
  }, [selectedPerson]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Tableaux de Conges */}
        <Row>
            <div className="col p-0">
                <div className="col">
                    <Card className="shadow">
                        <CardHeader className="bg-white border-0">
                            <h3 className="mb-0 text-center">Listes des Congés</h3>
                        </CardHeader>
                        <Row>
                            <Col lg="12">
                                {/* deleteSuccess && 
                                    <Alert className="text-center" color="success">
                                        {deleteSuccess}
                                    </Alert>
                                */}
                            </Col>
                        </Row>
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
                                {conge.map((c, index) => (
                                    <tr key={index}>
                                        <td>{c.matricule_personnel}</td>    
                                        <td>{c.nom_prenom_personnel}</td>    
                                        <td>{c.date_debut_conge.getFullYear() + "-" + (parseInt(c.date_debut_conge.getMonth()+1) <= 9 ? "0"+parseInt(c.date_debut_conge.getMonth()+1) : parseInt(c.date_fin_conge.getMonth()+1)) + "-" + c.date_debut_conge.getDate()}</td>
                                        <td>{c.date_fin_conge.getFullYear() + "-" + (parseInt(c.date_fin_conge.getMonth()+1) <= 9 ? "0"+parseInt(c.date_fin_conge.getMonth()+1) : parseInt(c.date_fin_conge.getMonth()+1)) + "-" + c.date_fin_conge.getDate()}</td>
                                        <td>{curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge ? Math.ceil((c.date_fin_conge - curr_date) / (1000 * 3600 * 24)) : Math.ceil((c.date_fin_conge - c.date_debut_conge)/ (1000 * 3600 * 24)) }</td>
                                        <td>{curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge 
                                            ? <Badge color="success">
                                                en cours
                                              </Badge>
                                            : <Badge color="warning">
                                                programmé
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
                                                      onClick={() => editConge(c)}
                                                      disabled
                                                    >
                                                      Modifier le congé
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      onClick={() => deleteConge(c)}
                                                    >
                                                        Annuler le congé
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      disabled={curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge ? false : true}
                                                      onClick={() => stopConge(c)}
                                                    >
                                                        Arreter le congé
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </div>
            </div>
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
                      <Col md="4">
                        <Button
                          color="primary"
                          onClick={(e) => saveConge(e)}
                          disabled={selectedPerson ? false : true}
                        >
                          Générer l'attestation
                        </Button>
                      </Col>
                      <Col md="4">
                        <Button
                          color="success"
                          onClick={(e) => saveEditedConge(e)}
                          disabled
                        >
                          Mettre à jour le congé
                        </Button>
                      </Col>
                      <Col md="4">
                        <Button
                          color="danger"
                          onClick={() => {}}
                        >
                          Annuler
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <PDFViewer width="100%" height="100%">
              <CongeDoc 
                name={name} 
                matricule={matricule}
                sexe={sexe}
                poste={poste} 
                type={type} 
                decision={selectedDec} 
                duration={duration} 
                structure={struc}
                startDate={startDate}
                endDate={endDate}
                repriseDate={repriseDate}
                typeConge={selectedType}
              />
            </PDFViewer>
          </Col>
          <Col md="12">
            <PDFDownloadLink document={<CongeDoc 
              name={name} 
              matricule={matricule}
              sexe={sexe}
              poste={poste} 
              type={type} 
              decision={selectedDec} 
              duration={duration} 
              structure={struc}
              startDate={startDate}
              endDate={endDate}
              repriseDate={repriseDate}
              typeConge={selectedType}/>} fileName={`attestation_${matricule}.pdf`}>
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : <Button color="primary">Télécharger l'attestation </Button>)}
            </PDFDownloadLink>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Conges;
