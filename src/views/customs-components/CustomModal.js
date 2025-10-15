import { useState, React } from 'react';
import {
    Row,
    Col,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    CardBody,
    FormText,
    Label,
    Alert,
  } from "reactstrap";

const CustomModal = ({ modal, toggleModal, modalData, handleArchiveChange, saveArchive, errorArchive, successArchive }) => {

    return (
        <Modal isOpen={modal} toggle={toggleModal} {...modalData}>
            <ModalHeader toggle={toggleModal}>
                <Row>
                    <Col>
                        <h3 className="mb-0">Archiver ce document</h3>
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <CardBody>
                    <Form>
                        <Row>
                            <Col>  
                                <FormGroup>
                                <Label
                                    for="demande-file"
                                >
                                    Attestation signé
                                </Label>
                                <Input
                                    id="demande-file"
                                    name="file"
                                    type="file"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={(e) => handleArchiveChange(e)}
                                />
                                <FormText>
                                    selectionner l'attestion signé à archivé (fichier accepté .jpeg, .png, .jpg)
                                </FormText>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Button
                                    color="success"
                                    size="md"
                                    onClick={() => saveArchive(modalData)}
                                    /*onClick={() => {
                                        console.log("current archive : " + modalData.nom_prenom_personnel)
                                    }}*/
                                >
                                    Archiver
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    color="danger"
                                    size="md"
                                    onClick={() => toggleModal()}
                                >
                                    Terminer
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                { errorArchive && (
                                    <Alert color="danger">
                                        {errorArchive}
                                    </Alert>
                                )}
                                { successArchive && (
                                    <Alert color="success">
                                        {successArchive}
                                    </Alert>
                                )}                                                                                    
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </ModalBody>
        </Modal>
    );
}

export default { CustomModal };