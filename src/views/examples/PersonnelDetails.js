import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "components/Headers/Header.js";

const PersonnelDetails = () => {
    
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    const [nberConge, setNberConge] = useState([]);
    const [nberPermission, setNberPermission] = useState([]);
    const [totalDays, setTotalDays] = useState(0);

    useEffect(() => {
        const func = async () => {
            try {
                const test_conge_req = `SELECT * FROM conge WHERE id_personnel = ${selectedPerson.id_personnel}`;
                window.electronAPI.getSpecificConge(test_conge_req);
                await window.electronAPI.retrieveSpecificConge((event, res) => {
                    setNberConge(res);
                })
                const last_permission_req = `SELECT * FROM permission WHERE id_personnel = ${selectedPerson.id_personnel}`;
                window.electronAPI.getLastPermission(last_permission_req);
                await window.electronAPI.retrieveLastPermission((event, res) => {
                    setNberPermission(res);
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, [selectedPerson.id_personnel])

    useEffect(() => {
        if (nberConge.length > 0) {
            let total = 0;
            nberConge.forEach(element => {
                total += element.duree_conge;
            });
            if (nberPermission.length > 0) {
                let total_permission = 0;
                nberPermission.forEach(element => {
                    total_permission += element.duree_permission;
                });
                setTotalDays(total + total_permission);
            } else {
                setTotalDays(total);
            }
        }
    }, [nberConge, nberPermission])

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--4" fluid>
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                  <Card className="card-profile shadow">
                    <Row className="justify-content-center mb-7">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={require("../../assets/img/theme/user_good.png")}
                            />
                          </a>
                        </div>
                      </Col>
                    </Row>
                    <CardBody className="my-4">
                      <div className="text-center my-4">
                        <div className="h3">
                            Matricule : {selectedPerson.matricule_personnel}
                        </div>
                        <div className="h3">
                            Categorie : {selectedPerson.categorie_personnel}
                        </div>
                        <hr className="my-4" />
                        <div className="h3 ">
                            Statistiques
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Nombres de Congés : {nberConge.length}
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Nombres de Permissions : {nberPermission.length}
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Nombres total de jours : {totalDays}
                        </div>
                        <hr className="my-4" />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-1" xl="8">
                    <Card>
                        <CardHeader className="bg-info border-0">
                            <Row className="align-items-center">
                                <Col xs="6">
                                    <h3 className="mb-0 text-white">Informations sur le personnel</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row className="text-left my-2">
                                <Col lg="12">
                                    <div className="h2">
                                        Noms et Prenoms
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.sexe_personnel === "M" ? "M" : "Mme"} {selectedPerson.nom_prenom_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Poste
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.poste_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Structure
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.structure_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Date de recrutement
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.date_recrutement_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Grade
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.grade_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Téléphone
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.telephone_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Situation Matrimoniale
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.situation_matrimoniale_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                                <Col lg="12">
                                    <div className="h2">
                                        Région d'origine
                                    </div>
                                    <div className="h3 font-weight-400">
                                        {selectedPerson.region_personnel}
                                    </div>
                                    <hr className="mt-2" />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
              </Row>
            </Container>
        </>
    );
};

export default PersonnelDetails;