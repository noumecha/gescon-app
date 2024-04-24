import { useEffect, useState } from "react";
import Select from "react-select";
import {
    Container,
    Row,
    Card,
    CardBody,
    CardTitle,
    Col
} from "reactstrap";

const StructureStats = () => {

    const [filter, setFilter] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [strucPers, setstrucPers] = useState(0);
    const [congeStruc, setCongeStruc] = useState(0);
    const [structureNames, setStructureNames] = useState([]);
    const [perf, setPerf] = useState(100);

    const options = structureNames.map((t, i) => ({
        value: t.structure_personnel,
        label: t.structure_personnel,
    }));
    
    const handleFilterChange = (f) => {
      setFilter(f);
    };

    const showStructuresStats = () => {
        let total_struc_personnel = 0;
        let total_struc_conge = 0;
        if (filter === null) {
            setstrucPers(0);
            setCongeStruc(0);
        }
        if (personnel.length > 0) {
            personnel.forEach(person => {
                if (filter !== null && person.structure_personnel === filter.value) {
                    total_struc_personnel++;
                }
            })
        }
        if (personnel.length > 0) {
            personnel.forEach(person => {
                if (filter !== null && person.structure_personnel === filter.value && person.statut_personnel === "en congé") {
                    total_struc_conge++;
                }
            })
        }
        setstrucPers(total_struc_personnel);
        setCongeStruc(total_struc_conge);
    }

    useEffect(() => {
        const func = async () => {
          const prf = congeStruc === 0 ? 100 : Number.parseFloat(100 - ((congeStruc * 100)/ strucPers)).toFixed(2);
          setPerf(prf);
        }
        func();
    })

    const fetchDatas = async () => {
        try {
          window.electronAPI.getStructuresNames();
          await window.electronAPI.retrieveStructuresNames((event, res) => {
            setStructureNames(res);
          })
          window.electronAPI.getPersonnel();
          await window.electronAPI.receivePersonnel((event, res) => {
            setPersonnel(res);
          })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
      }
      // useEffect for getting data
    useEffect(() => {
        fetchDatas();
    }, []);
    
    return (
        <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <Row className="">
                    <Col lg="9">
                        <Select
                            value={filter}
                            onChange={handleFilterChange}
                            options={options}
                            isSearchable={true}
                            placeholder="Selectionner la structure"
                        />
                    </Col>
                    <Col lg="3">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-md" 
                            onClick={() => showStructuresStats()}
                        >
                            Afficher les Statistiques
                        </button>
                    </Col>
                </Row>
                {/* Card stats */}
                <Row className="mt-4">
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
                              { strucPers ? strucPers : "0"}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                              <i className="fas fa-chart-bar" />
                            </div>
                          </Col>
                        </Row>
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
                              { congeStruc ? congeStruc : 0 }
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                              <i className="fas fa-users" />
                            </div>
                          </Col>
                        </Row>
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
                            <span className="h2 font-weight-bold mb-0"> { perf ? perf : 0}%</span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                              <i className="fas fa-percent" />
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
            </Container>
        </div>
      </>
    );
}

export default StructureStats;