import {
    Container,
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
    Row
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import PermissionDoc from "documents/PermissionDoc";

const Permission = () => {
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    const [endDate, setEndDate] = useState("");
    const [repDate, setRepDate] = useState("");
    const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom : "TCHUENTE");
    const [telephone, setTelephone] = useState(selectedPerson ? selectedPerson.telephone : "653465348");
    const [startDate, setStartDate] = useState("");
    const [decision, setDecision] = useState([]);
    const [selectedDec, setSelectedDec] = useState("");
    const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule : "XD3 566");
    const [type, setType] = useState(selectedPerson ? selectedPerson.type === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
    const [structure, setStructure] = useState(selectedPerson ? selectedPerson.structure : "Service Général");
    const [duration, setDuration] = useState("");
    const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste : "Contrôleur");
    const sexe = selectedPerson ? selectedPerson.sexe : "M"; 

    const handleInputChange = (setStateFunction) => (e) => {
        setStateFunction(e.target.value);
    };

    const addPersmission = async (e) => {
        e.preventDefault();
        try {
            
        } catch (error) {
            
        }
    }

    useEffect(() => {
        const calculateEndDate = () => {
          if (startDate && duration) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(end.getDate() + parseInt(duration));
            // Mettre à jour l'interface utilisateur avec la date de fin
            setEndDate(end.toISOString().split("T")[0]);
            const reprDate = new Date(end);
            reprDate.setDate(end.getDate() + parseInt(1));
            setRepDate(reprDate.toISOString().split("T")[0]);
          }
        };
        calculateEndDate();
      }, [startDate, duration, repDate]);

    /** useeffect for fetching */
    useEffect(() => {
        const func = async () => {
            try {
                window.electronAPI.getDecision();
                await window.electronAPI.retrieveDecision((event, res) => {
                    setDecision(res);
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
                <Col className="order-xl-1" md="12" lg="12">
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
                                <Col md="6">
                                    <FormGroup>  
                                    <Label for="num-decision">
                                        Numero de Décision
                                    </Label>              
                                    <Input
                                        className="mb-3"
                                        type="select"
                                        id="num-decision"
                                        onChange={handleInputChange(setSelectedDec)}
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
                                        onClick={addPersmission}
                                        onSubmit={addPersmission}
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
                        <PermissionDoc 
                            name={name}
                            matricule={matricule}
                            sexe={sexe}
                            type={type}
                            poste={poste}
                            decision={selectedDec} 
                            duration={duration} 
                            structure={structure}
                            startDate={startDate}
                            endDate={endDate}
                            repriseDate={repDate}
                        />
                    </PDFViewer>
                </Col>
                <Col md="12">
                <PDFDownloadLink document={<PermissionDoc 
                    name={name}
                    matricule={matricule}
                    sexe={sexe}
                    type={type}
                    poste={poste}
                    decision={selectedDec} 
                    duration={duration} 
                    structure={structure}
                    startDate={startDate}
                    endDate={endDate}
                    repriseDate={repDate}
                />} fileName="attestation_test.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : <Button color="primary">Télécharger l'attestation </Button>)}
                </PDFDownloadLink>
            </Col>
        </Row>
        </Container>
      </>
    );
}

export default Permission;