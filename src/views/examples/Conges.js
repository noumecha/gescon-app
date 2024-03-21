/* eslint-disable no-unused-vars */
import {
  Badge,
  Card,
  Button,
  CardHeader,
  CardBody,
  FormGroup,
  FormText,
  Form,
  Input,
  Label,
  Modal,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from "documents/MyDocument";

const Conges = () => {
  const location = useLocation();
  /** recuperation des attributs d'un personnel depuis personnel.js */
  const { selectedPerson } = location.state || {};
  const [decision, setDecision] = useState([]);
  const [typeConge, setTypeConge] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repriseDate, setRepriseDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom : "TCHUENTE");
  const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule : "XD3 566");
  const [type, setType] = useState(selectedPerson ? selectedPerson.type === 1 ? "Contractuelle" : "Fonctionnaire" : "Contractuelle");
  const [dec, setDec] = useState("");
  const [struc, setStruc] = useState(selectedPerson ? selectedPerson.structure : "Service Général");

  const handleStrucChange = (e) => {
    setStruc(e.target.value);
  }

  const handleDecChange = (e) => {
    setDec(e.target.value)
  }

  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleMatriculeChange = (e) => {
    setMatricule(e.target.value);
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  }

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  }

  const handleSelectedTypeChange = (e) => {
    setSelectedType(e.target.value);
  }

  useEffect(() => {
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
  }, [startDate, duration]);

  /** useeffect for common function and fetching */
  useEffect(() => {
    const func = async () => {
        try {
            window.electronAPI.getDecision();
            await window.electronAPI.retrieveDecision((event, res) => {
              setDecision(res);
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
  }, []);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Définir un nouveau congé</h3>
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
                            onChange={handleNameChange}
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
                            defaultValue={selectedPerson ? selectedPerson.telephone : 696879475}
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
                            onChange={handleMatriculeChange}
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
                            defaultValue={selectedPerson ? selectedPerson.poste : "SG"}
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
                            onChange={handleTypeChange}
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
                            onChange={handleStrucChange}
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
                            defaultValue="choisir le type de congé"
                            onChange={handleSelectedTypeChange}
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
                        <FormGroup row>
                          <Label
                            for="demande-file"
                            sm={2}
                          >
                            Demande Timbré
                          </Label>
                          <Input
                            id="demande-file"
                            name="file"
                            type="file"
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
                          <FormGroup row>
                            <Label
                              for="exampleFile"
                              sm={2}
                            >
                              Document
                            </Label>
                            <Input
                              id="exampleFile"
                              name="file"
                              type="file"
                            />
                            <FormText>
                              Pièces à fournir comme justificatif
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
                            onChange={handleStartDateChange}
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
                            onChange={handleDurationChange}
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
                            type="select"
                            id="num-decision"
                            onChange={handleDecChange}
                          >
                            {decision && decision.length > 0 
                              ? decision.map((d, i) => (
                                <option key={i}>{d.numero_decision}</option>
                              ))
                              : (<option>Selectionner le numero de décision</option>)
                            }
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Button
                          color="primary"
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
              <MyDocument 
                name={name} 
                matricule={matricule} 
                type={type} 
                decision={dec} 
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
            <PDFDownloadLink document={<MyDocument 
              name={name} 
              matricule={matricule} 
              type={type} 
              decision={dec} 
              duration={duration} 
              structure={struc}
              startDate={startDate}
              endDate={endDate}
              repriseDate={repriseDate}/>} fileName="attestation_test.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : <Button color="primary">Télécharger l'attestation </Button>)}
            </PDFDownloadLink>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Conges;
