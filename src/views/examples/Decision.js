import {
    Container,
    Row,
    Col,
    FormGroup,
    Form,
    Input,
    CardBody,
    Card,
    Alert,
    CardHeader,
    Table,
    DropdownItem,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    Button,
    Label,
    Badge,
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";

const Decision = () => {

    const [decision, setDecision] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [numeroDecision, setNumeroDecision] = useState("");
    const [objetDecision, setObjetDecision] = useState("");
    const [signataireDecision, setSignataireDecision] = useState("");
    const [decisionDate, setDecisionDate] = useState("");
    const [decisionType, setDecisionType] = useState("");
    const [dec, setDec] = useState({});
    const [message, setMessage] = useState("Ajouter une nouvelle decision");
    const [action, setAction] = useState(1);
    const [decId, setDecId] = useState();
    const [errorTop, setErrorTop] = useState();

    function formatDate(d) {
      const date = new Date(d);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return new Date(year, month, day);
    }

    const handleSetUseDecision = (dec) => {
      try {
        if (dec.statut_decision === "activé") {
          setErrorTop("Impossible d'activé cette permission car elle est déjà activé");
          setTimeout(() => {
              setErrorTop("");
          }, 4000)
          return;
        }
        let query = `UPDATE decision SET statut_decision = "activé" WHERE id_decision = ${dec.id_decision} AND id_type_personnel = ${dec.id_type_personnel}`;
        window.electronAPI.updateDecision(query);
        window.electronAPI.updateDecisionSuccess(() => {
            setDeleteSuccess("Decision activé avec succès");
            setTimeout(() => {
                setDeleteSuccess("");
            }, 3000)
        });
        let query_change = `UPDATE decision SET statut_decision = "désactivé" WHERE id_decision NOT IN (${dec.id_decision}) AND id_type_personnel = ${dec.id_type_personnel}`;
        window.electronAPI.updateDecision(query_change);
        window.electronAPI.updateDecisionSuccess(() => {
            setDeleteSuccess("Plusieurs autre décisions on été désactivé");
            setTimeout(() => {
                setDeleteSuccess("");
            }, 3000)
        });
      } catch (err) {
        console.log(`Erreur d'activation de la décision : ${error.message}`);
      }
    };

    const handleDecisionEdit = (dec) => {
        setNumeroDecision(dec.numero_decision);
        setMessage(`Modifier la decision N°${dec.numero_decision}`);
        setObjetDecision(dec.objet_decision);
        setSignataireDecision(dec.signataire_decision);
        const date = formatDate(dec.date_decision);
        date.setDate(date.getDate() + 1);
        setDecisionDate(date.toISOString().split("T")[0]);
        setDecisionType(dec.type_decision);
        setDecId(dec.id_decision);
        setDec(dec);
        setAction(2);
    }

    const handleDecisionDelete = (dec) => {
        //console.log("decision selected for deletion", dec);
        const req = `DELETE FROM decision WHERE id_decision = ${dec.id_decision}`;
        window.electronAPI.deleteDecision(req);
        window.electronAPI.deleteDecisionSuccess(() => {
            setDeleteSuccess("Supprimé avec succès");
            setTimeout(() => {
                setDeleteSuccess("");
            }, 3000)
        });
    }

    const handleInputChange = (setStateFunction) => (e) => {
        setStateFunction(e.target.value); 
    }

    const addDecision = async (e) => {
        e.preventDefault();
        try {
          if (numeroDecision === "" || objetDecision === "" || signataireDecision === "" || decisionDate === "" || decisionType === "") {
            setError('Veuillez remplir tous les champs');
            setTimeout(() => {
              setError("");
            }, 7000)
            return;
          } else {
            const data = {
              numero_decision: numeroDecision.toUpperCase(),
              objet_decision: objetDecision,
              signataire_decision: signataireDecision,
              date_decision: decisionDate,
              type_decision: decisionType,
              created_at : new Date().toISOString().slice(0,19).replace('T',' ')
            }
            decisionType === "Decision Fonctionnaire" ? data.type_decision = 1 : data.type_decision = 2;
            const date = new Date(data.date_decision)
            const d = date.toISOString().slice(0, 19).replace('T', ' ');
            data.date_decision = d;
            let req = "";
            if (action === 1) {
              req = `INSERT INTO decision (numero_decision,objet_decision,signataire_decision,id_type_personnel,date_decision,created_at_decision) VALUES ("${data.numero_decision}", "${data.objet_decision}", "${data.signataire_decision}", ${data.type_decision}, "${data.date_decision}","${data.created_at}")`;
            } else {
              req = `UPDATE decision SET numero_decision="${data.numero_decision}",objet_decision="${data.objet_decision}",signataire_decision="${data.signataire_decision}",id_type_personnel=${data.type_decision},date_decision="${data.date_decision}",created_at_decision="${data.created_at}" WHERE id_decision=${decId}`;
            }
            console.log("data: " + JSON.stringify(data));
            console.log("requete : " , req);
            window.electronAPI.addDecision(req);
            setSuccess("Enregistré avec succès");
            setTimeout(() => {
                setSuccess("");
            }, 3000)
            setNumeroDecision("");
            setObjetDecision("");
            setSignataireDecision("");
            setDecisionDate("");
            setMessage("Ajouter une nouvelle decision")
          }
        } catch (err) {
            console.error("Erreur Trouvé : " + err.message);
        }
      }

    /** useeffect for common function and fetching */
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
    }, [decision]);

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col p-0">
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <h3 className="mb-0 text-center">Listes des Décision</h3>
                            </CardHeader>
                            <Row>
                                <Col lg="12">
                                    { deleteSuccess && 
                                        <Alert className="text-center" color="success">
                                            {deleteSuccess}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    { errorTop && 
                                        <Alert className="text-center" color="danger">
                                            {errorTop}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th>Numero</th>
                                        <th>Objet</th>
                                        <th>Signataire</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {decision.map((decision, index) => (
                                        <tr key={index}>
                                            <td>{decision.numero_decision}</td>    
                                            <td>{decision.objet_decision}</td>    
                                            <td>{decision.signataire_decision}</td>    
                                            <td>{decision.date_decision.getFullYear() + "-" + (parseInt(decision.date_decision.getMonth()+1) <= 9 ? "0"+parseInt(decision.date_decision.getMonth()+1) : parseInt(decision.date_decision.getMonth()+1)) + "-" + decision.date_decision.getDate()}</td>
                                            <td>{decision.libelle_type_personnel}</td>
                                            <td>{decision.statut_decision === "activé"
                                                ? <Badge color="success">
                                                    {decision.statut_decision}
                                                  </Badge>
                                                : 
                                                  <Badge color="warning">
                                                    {decision.statut_decision}
                                                  </Badge>
                                                }
                                              </td>
                                            <td className="text-right">
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                    className="btn-icon-only text-light"
                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={(e) => e.preventDefault()}
                                                    >
                                                        <i className="fas fa-ellipsis-v" />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem
                                                            onClick={() => handleDecisionEdit(decision)}
                                                        >
                                                            Modifier
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => handleDecisionDelete(decision)}
                                                        >
                                                            Supprimer
                                                        </DropdownItem>
                                                        <DropdownItem
                                                          onClick={() => handleSetUseDecision(decision)}
                                                        >
                                                          activer
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </div>
            </Row>
            <Row>
                {/*JSON.stringify(decision)*/}
            </Row>
            <Row>
                <Col className=" mt-5 order-xl-1" md="12" lg="12">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-primary border-0">
                      <Row className="align-items-center">
                        <Col xs="12" md="12" lg="12">
                            <h3 className="mb-0 text-white text-center">{message}</h3>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <div className="pl-lg-4">
                                <Row>
                                  <Col lg="12">
                                    { success && 
                                      <Alert color="success">
                                        {success}
                                      </Alert>
                                    }
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-decision-number"
                                      >
                                        Numero de decision
                                      </label>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-decision-number"
                                        defaultValue={numeroDecision}
                                        onChange={handleInputChange(setNumeroDecision)}
                                        placeholder="Numero de decision"
                                        type="text"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-objet-decision"
                                      >
                                        Objet
                                      </label>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-objet-decision"
                                        defaultValue={objetDecision}
                                        onChange={handleInputChange(setObjetDecision)}
                                        placeholder="Objet"
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
                                                htmlFor="input-signataire-decision"
                                            >
                                                Signataire
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-signataire-decision"
                                                defaultValue={signataireDecision}
                                                onChange={handleInputChange(setSignataireDecision)}
                                                placeholder="Signataire Decision"
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="date-depart">
                                                Date de la décision
                                            </Label>
                                            <Input
                                                id="date-depart"
                                                name="date"
                                                onChange={handleInputChange(setDecisionDate)}
                                                value={decisionDate}
                                                placeholder="date"
                                                type="date"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="pl-lg-4">
                            <Row>
                                <Col md="6">
                                  <FormGroup>  
                                    <Label for="type-conge">
                                      Type de decision
                                    </Label>
                                    { Object.keys(dec).length > 0 ? 
                                        <Input
                                            className="mb-3"
                                            type="select"
                                            id="type-conge"
                                            defaultValue="choisir le type de congé"
                                            onChange={handleInputChange(setDecisionType)}
                                        >
                                          <option>{decisionType === "Decision Fonctionnaire" ? decisionType : "Decision Contractuel"}</option>
                                          <option>{decisionType === "Decision Contractuel" ? decisionType : "Decision Fonctionnaire"}</option>
                                        </Input>
                                        : 
                                        <Input
                                        className="mb-3"
                                        type="select"
                                        id="type-conge"
                                        defaultValue="choisir le type de congé"
                                        onChange={handleInputChange(setDecisionType)}
                                        >
                                            <option>Decision Contractuel</option>
                                            <option>Decision Fonctionnaire</option>
                                        </Input>
                                    }              
                                    
                                  </FormGroup>
                                </Col>
                              </Row>
                            <Row>
                                <Col lg="12">
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
                                    onSubmit={addDecision}
                                    onClick={addDecision}
                                  >
                                    { Object.keys(dec).length > 0 ? `Enregistrer les modifications` : "Ajouter la decision"}
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                        </Form>
                    </CardBody>
                  </Card>
                </Col>
            </Row>
        </Container>
      </>
    );
}

export default Decision;