/* eslint-disable no-unused-vars */
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Button,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "components/Headers/Header.js";
import PersonnelDoc from "documents/PersonnelDoc";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

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
        setTotalDays(selectedPerson.nb_jours_conges + selectedPerson.nb_jours_permission);
        /*if (nberConge.length > 0 || nberPermission.length > 0) {
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
        }*/
    },[selectedPerson] /*[nberConge, nberPermission]*/)

    function formatDate(d, m) {
        const date = new Date(d);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        if (m === 0) {
            return new Date(year, month, day);
        }
        if (m === 1) {
            return new Date(year, month, day).getDate() + "/" + (new Date(year, month, day).getMonth() < 10 ? "0"+parseInt(new Date(year, month, day).getMonth()+1) : parseInt(new Date(year, month, day).getMonth()+1))+ "/" + new Date(year, month, day).getFullYear()
        }
    }  

    //let statistics = [stat1, stat2]
    let statistics = nberConge.reduce((acc, conge) => {
        let year = formatDate(conge.date_debut_conge, 0).getFullYear();
        let existingStat = acc.find(stat => stat.year === year);
        if (existingStat) {
            existingStat.totalYearsConge += 1;
            existingStat.conges.push({
                id : conge.id_conge,
                dd : formatDate(conge.date_debut_conge, 1),
                df : formatDate(conge.date_fin_conge, 1),
                duree : conge.duree_conge
            });
        } else {
            acc.push({
                year : year,
                totalYearsConge : 1,
                conges : [{
                    id : conge.id_conge,
                    dd : formatDate(conge.date_debut_conge, 1),
                    df : formatDate(conge.date_fin_conge, 1),
                    duree : conge.duree_conge
                }]
            });
        }
        return acc;
    }, []);
    // statistics permissions : 
    let statisticsPermission = nberPermission.reduce((acc, permission) => {
        let year = formatDate(permission.date_debut_permission, 0).getFullYear();
        let existingStat = acc.find(stat => stat.year === year);
        if (existingStat) {
            existingStat.totalYearsPermission += 1;
            existingStat.permissions.push({
                id : permission.id_permission,
                dd : formatDate(permission.date_debut_permission, 1),
                df : formatDate(permission.date_fin_permission, 1),
                duree : permission.duree_permission
            });
        } else {
            acc.push({
                year : year,
                totalYearsPermission : 1,
                permissions : [{
                    id : permission.id_permission,
                    dd : formatDate(permission.date_debut_permission, 1),
                    df : formatDate(permission.date_fin_permission, 1),
                    duree : permission.duree_permission
                }]
            });
        }
        return acc;
    }, []);

    console.log(`statistics congés : ${JSON.stringify(statistics)}`);
    console.log(`statistics permissions : ${JSON.stringify(statisticsPermission)} `);

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
                {<Row>
                    <PDFViewer className="w-100">
                        <PersonnelDoc
                            name={selectedPerson.nom_prenom_personnel}
                            statistics={statistics}
                            statisticsPermission={statisticsPermission}
                            conges={selectedPerson.nb_jours_conges}
                            permissions={selectedPerson.nb_jours_permission}
                        />
                    </PDFViewer>
                </Row>}
                <Row>
                    <Col className="order-xl-1" xl="8">
                        <PDFDownloadLink document={<PersonnelDoc  
                                name={selectedPerson.nom_prenom_personnel}
                                statistics={statistics}
                                statisticsPermission={statisticsPermission}
                                conges={selectedPerson.nb_jours_conges}
                                permissions={selectedPerson.nb_jours_permission}              
                            />} fileName={`fiche_du_personnel_${selectedPerson.nom_prenom_personnel}.pdf`}>
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                            <Button
                                color="success"
                            >
                                Télécharger la fiche du personnel 
                            </Button>)}
                        </PDFDownloadLink>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PersonnelDetails;