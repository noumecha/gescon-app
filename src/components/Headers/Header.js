/* eslint-disable no-unused-vars */
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useState, useEffect } from "react";

const Header = () => {

  //const [demande, setDemande] = useState([]);
  const [nberPersonnel, setNberPersonnel] = useState();
  const [conge, setConge] = useState([]);

  useEffect(() => {
    const func = async () => {
        try {
            /*window.electronAPI.getDemandeConge();
            await window.electronAPI.retrieveDemandeConge((event, res) => {
              setDemande(res);
            })*/
            window.electronAPI.getConge();
            await window.electronAPI.retrieveConge((event, res) => {
              setConge(res);
            })
            window.electronAPI.getPersonnel();
            await window.electronAPI.receivePersonnel((event, res) => {
              //console.log("pers event : " + res.length);
              setNberPersonnel(res.length);
            });
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }
    func();
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Personnel
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {nberPersonnel ? nberPersonnel : "" }
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 0%
                      </span>{" "}
                      <span className="text-nowrap">Depuis le dernier mois</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Personnels en Congés
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          { conge ? conge.length : 0 }
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 0%
                      </span>{" "}
                      <span className="text-nowrap">Depuis hier</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Performance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Depuis le dernier mois</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
