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
  DropdownItem
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
  const sexe = selectedPerson ? selectedPerson.sexe_personnel : "M";
  const nb_jours_conges = selectedPerson ? selectedPerson.nb_jours_conges : 18
  const [demande, setDemande] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const status = `${sexe === 'M' ? 'M' : 'Mme'} ${name} à droit à ${nb_jours_conges} ${nb_jours_conges > 1 ? "jours" : "jour"} de congés`
  const [visible, setVisible] = useState(true)
  const [deleteSuccess, seDeleteSuccess] = useState("");
  const [conge, setConge] = useState([]);

  const onDismiss = () => setVisible(false)

  const handleInputChange = (setStateFunction) => (e) => {
    setStateFunction(e.target.value);
  };

  const handleFileChange = (setStateFunction) => (e) => {
    setStateFunction(e.target.files[0]);
  }

  const fileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
      if (!demande) {
        setError("Veuillez sélectionner une demande de congé.");
        setTimeout(() => {
          setError("");
        }, 7000);
        return;
      }
      if (typeConge === "" || name === "" || startDate === "" || endDate === "" || duration === "" || repriseDate === "" || selectedType === "" || matricule === "" || type === "" || selectedDec === "" || struc === "" || poste === "" || demande === "" || document === "") {
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
          poste: poste, 
          type: type,
          decision: selectedDec, 
          duration: duration,
          structure: struc,
          startDate: startDate,
          endDate: endDate,
          repriseDate: repriseDate,
          typeConge: selectedType,
        }
        const demandeFile = fileToArrayBuffer(demande);
        console.log("demande file : " , demandeFile);
        const conge_data = {
          startDate : startDate,
          endDate : endDate,
          duration : duration,
          id_personnel: selectedPerson.id_personnel,
          curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
          demande : demandeFile,
          id_type_conge : selectedType === "congé administratif partiel" ? 1 : selectedType === "congé administratif total" ? 2 : selectedType === "congé maternité" ? 3 : selectedType === "congé maladie" ? 4 : 0
        }
        //console.log("conge : " + JSON.stringify(conge_data));
        //console.log("attestation : " , attestation);
        const req_conge = `INSERT INTO conge 
          (date_debut_conge, date_fin_conge, duree_conge, created_at_conge,attestation_conge,id_type_conge,id_personnel,demande_conge) 
          VALUES ("${conge_data.startDate}","${conge_data.endDate}",${conge_data.duration},"${conge_data.curr_date}",${JSON.stringify(attestation)},${conge_data.id_type_conge},${conge_data.id_personnel},"${conge_data.demandeFile}");`;
        //const req_personnel = `UPDATE personnel SET statut_personnel = "en congé",nb_jours_conges = (nb_jours_conges - ${duration}) WHERE id_personnel = ${conge_data.id_personnel};`;
        window.electronAPI.addConge(req_conge);
        //window.electronAPI.updatePersonnel(req_personnel);
        window.electronAPI.congeAddedSuccess(() => {
          setSuccess("congé ajouté avec succès");
        });
        setTimeout(() => {
            setSuccess("");
        }, 3000)
      }
    } catch (error) {
      console.error("Erreur saving congé : " + error.message);
    }
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
        // Mettre à jour l'interface utilisateur avec la date de fin
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
          /*window.electronAPI.getDecision();
          await window.electronAPI.retrieveDecision((event, res) => {
            setDecision(res);
          })*/
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
                                { deleteSuccess && 
                                    <Alert className="text-center" color="success">
                                        {deleteSuccess}
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th>Numero</th>
                                    <th>Objet</th>
                                    <th>Signataire</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conge.map((c, index) => (
                                    <tr key={index}>
                                        <td>{c.id_conge}</td>    
                                        <td>{c.duree_conge}</td>    
                                        <td>{c.id_personnel}</td>    
                                        <td>{c.date_fin_conge.getFullYear() + "-" + (parseInt(c.date_fin_conge.getMonth()+1) <= 9 ? "0"+parseInt(c.date_fin_conge.getMonth()+1) : parseInt(c.date_fin_conge.getMonth()+1)) + "-" + c.date_fin_conge.getDate()}</td>
                                        <td>{c.libelle_type_personnel}</td>
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
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        Modifier
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        Supprimer
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
                            defaultValue={selectedPerson ? selectedPerson.telephone_personnel : 696879475}
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
                            defaultValue={struc}
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
                            onChange={handleFileChange(setDemande)}
                          />
                          <FormText>
                            selectionner la demande
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
                              onChange={handleFileChange(setDocument)}
                            />
                            <FormText>
                              Pièces à fournir comme justificatif en fonction du type de congé (maladie ou maternité)
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
