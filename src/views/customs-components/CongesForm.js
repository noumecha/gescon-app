import React from 'react';
import { Row,Col,Card,CardHeader,Alert,Form,Input,FormGroup,Label,FormText,Button,CardBody } from 'reactstrap';
import Select from "react-select";

const CongesForm = ({
    status,
    visible,
    onDismiss,
    name,
    setName,
    setTelphone,
    telephone,
    matricule,
    setMatricule,
    poste,
    setPoste,
    type,
    setType,
    struc,
    setStruc,
    selectedType,
    setSelectedType,
    typeConge,
    handleFileChange,
    setDemande,
    setDocument,
    handleInputChange,
    setStartDate,
    startDate,
    duration,
    setDuration,
    endDate,
    selectedDec,
    error,
    buttonText,
    buttonClass,
    success,
    saveConge,
    actived,
    handleFilterChange
}) => {
    return (
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
                          <Select
                            value={selectedType}
                            onChange={handleFilterChange(setSelectedType)}
                            options={typeConge.map((t) => ({ value: t.libelle_type_conge, label: t.libelle_type_conge }))}
                            isSearchable
                            placeholder="Selectionner le type de congé"
                          />
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
                    {selectedType.value === "congé maladie" || selectedType.value === "congé maternité" ? (
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
                          color={buttonClass}
                          onClick={saveConge}
                          //disabled={actived}
                        >
                          {buttonText}
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
};

export default CongesForm;