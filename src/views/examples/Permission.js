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
    const [permissionData, setPermissionData] = useState({
        decision: [],
        startDate: "",
        telephone: selectedPerson ? selectedPerson.telephone : "653465348",
        endDate: "",
        repriseDate: "",
        name: selectedPerson ? selectedPerson.nom_prenom : "TCHUENTE",
        matricule: selectedPerson ? selectedPerson.matricule : "XD3 566",
        type: selectedPerson ? selectedPerson.type === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire",
        structure: selectedPerson ? selectedPerson.structure : "Service Général",
        duration: "",
        poste: selectedPerson ? selectedPerson.poste : "Contrôleur",
        sexe: selectedPerson ? selectedPerson.sexe : "Service Général",
    });

    const handlePermissionDataChange = (e) => {
        const { name, value } = e.target.value;
        setPermissionData({...permissionData, [name]: value });
    };

    const setPermissionEndDate = (value) => {
        setPermissionData({...permissionData, endDate: value });
    }

    useEffect(() => {
        const calculateEndDate = () => {
          if (permissionData.startDate && permissionData.duration) {
            const start = new Date(permissionData.startDate);
            const end = new Date(start);
            end.setDate(end.getDate() + parseInt(permissionData.duration));
            // Mettre à jour l'interface utilisateur avec la date de fin
            //setPermissionData({endDate : end.toISOString().split("T")[0]});
            setPermissionEndDate(end.toISOString().split("T")[0]);
            console.log("end date : " + permissionData.endDate);
            const repDate = new Date(end);
            repDate.setDate(end.getDate() + parseInt(1));
            setPermissionData({repriseDate: repDate.toISOString().split("T")[0] })
            //setRepriseDate(repDate.toISOString().split("T")[0]);
          }
        };
        calculateEndDate();
      }, []);
    /** useeffect for common function and fetching */
    useEffect(() => {
        const func = async () => {
            try {
                window.electronAPI.getDecision();
                await window.electronAPI.retrieveDecision((event, res) => {
                    setPermissionData({...permissionData, decision: res})
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, [permissionData]);

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
                                    defaultValue={permissionData.name}
                                    onChange={handlePermissionDataChange}
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
                                    defaultValue={permissionData.telephone}
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
                                    defaultValue={permissionData.matricule}
                                    onChange={handlePermissionDataChange}
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
                                    defaultValue={permissionData.poste}
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
                                    defaultValue={permissionData.type}
                                    id="input-type"
                                    onChange={handlePermissionDataChange}
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
                                    defaultValue={permissionData.structure}
                                    id="input-structure"
                                    onChange={handlePermissionDataChange}
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
                            <Row>
                            <Col md="6">
                                <FormGroup>
                                <Label for="date-depart">
                                    Date de départ
                                </Label>
                                <Input
                                    id="date-depart"
                                    name="date"
                                    onChange={handlePermissionDataChange}
                                    defaultValue={permissionData.startDate}
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
                                    defaultValue={permissionData.duration}
                                    onChange={handlePermissionDataChange}
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
                                    value={permissionData.endDate}
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
                                    onChange={handlePermissionDataChange}
                                >
                                    {permissionData.decision && permissionData.decision.length > 0 
                                    ? permissionData.decision.map((d, i) => (
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
                        <PermissionDoc 
                            name="{name}"
                            matricule="{matricule}"
                            type="{type}" 
                            decision="{dec}" 
                            duration="{duration}" 
                            structure="{struc}"
                            startDate="{startDate}"
                            endDate="{endDate}"
                            repriseDate="{repriseDate}"
                            typeConge="{selectedType}"
                        />
                    </PDFViewer>
                </Col>
                <Col md="12">
                <PDFDownloadLink document={<PermissionDoc 
                    name="{name}"
                    matricule="{matricule}"
                    type="{type}" 
                    decision="{dec}" 
                    duration="{duration}" 
                    structure="{struc}"
                    startDate="{startDate}"
                    endDate="{endDate}"
                    repriseDate="{repriseDate}"
                    typeConge="{selectedType}"
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