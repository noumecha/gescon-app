import React from 'react';
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
    Row,
    Alert,
} from "reactstrap";

const PersmissonsForm = ({

}) => {
    return (
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
    );
}

export default PersmissonsForm;