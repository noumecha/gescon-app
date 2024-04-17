import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    CardFooter,
} from "reactstrap";
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "components/Headers/Header.js";

const PersonnelDetails = () => {
    
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    // Display detailed information about the personnel
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
                        <hr className="my-4" />
                        <div className="h3 ">
                            Statistiques
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Congés : 10
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Permissions : 30
                        </div>
                        <div className="h4 mt-4 font-weight-400">
                            Nombres total de jours : 40
                        </div>
                        <hr className="my-4" />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-1" xl="8">
                    <Card>
                        <CardHeader>
                            <Row className="align-items-center">
                                <Col xs="6">
                                    <h3 className="mb-0">Mes informations</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>

                        </CardBody>
                        <CardFooter>

                        </CardFooter>
                    </Card>
                </Col>
              </Row>
            </Container>
        </>
    );
};

export default PersonnelDetails;