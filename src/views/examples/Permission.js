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
    Row,
    Alert,
    Table,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import PermissionDoc from "documents/PermissionDoc";

const Permission = () => {
    const location = useLocation();
    const { selectedPerson } = location.state || {};
    const [endDate, setEndDate] = useState("");
    const [repDate, setRepDate] = useState("");
    const [name, setName] = useState(selectedPerson ? selectedPerson.nom_prenom_personnel : "TCHUENTE");
    const [telephone, setTelephone] = useState(selectedPerson ? selectedPerson.telephone_personnel : "653465348");
    const [startDate, setStartDate] = useState("");
    const [matricule, setMatricule] = useState(selectedPerson ? selectedPerson.matricule_personnel : "XD3 566");
    const [type, setType] = useState(selectedPerson ? selectedPerson.id_type_personnel === 1 ? "Fonctionnaire" : "Contractuelle" : "Fonctionnaire");
    const [structure, setStructure] = useState(selectedPerson ? selectedPerson.structure_personnel : "Service Général");
    const [duration, setDuration] = useState("");
    const [poste, setPoste] = useState(selectedPerson ? selectedPerson.poste_personnel : "Contrôleur");
    const [demande, setDemande] = useState(null);
    const sexe = selectedPerson ? selectedPerson.sexe_personnel : "M"; 
    const id_personnel = selectedPerson ? selectedPerson.id_personnel : "1"; 
    const [permission, setPermission] = useState([]);
    const [lastPermission, setLastPermission] = useState([]);
    const curr_date = new Date();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const nb_jours_permission = selectedPerson ? selectedPerson.nb_jours_permission : 10;
    const [status, setStatus] = useState(`${sexe === 'M' ? 'M' : 'Mme'} ${name} à droit à ${nb_jours_permission} ${nb_jours_permission > 1 ? "jours" : "jour"} de permissions`);
    const [visible, setVisible] = useState(true);
    const [deleteSuccess, setDeleteSuccess] = useState("");


    // usefull function 

    const onDismiss = () => setVisible(false)

    const handleInputChange = (setStateFunction) => (e) => {
        setStateFunction(e.target.value);
    };

    const editPermission = (p) => {
        console.log("you want to edit the permission : ", p);
    }

    const deletePermission = async (p) => {
        //console.log("you want to delete the permission : ", p);
        const req_permission = `DELETE FROM permission WHERE id_permission = '${p.id_permission}'`; 
        const statut = "en poste";
        const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}",nb_jours_permission = 10 WHERE id_personnel = ${p.id_personnel};`;
        window.electronAPI.addPermission(req_permission);
        window.electronAPI.updatePersonnel(req_personnel);
        setDeleteSuccess("permission supprimé avec succès");
        setStatus(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
        /*window.electronAPI.permissionAddedSuccess(() => {
        });*/
        setTimeout(() => {
            setError("");
        },3000)
        return;
    }

    const stopPermission = (p) => {
        console.log("you want to stop the permission : ", p);
    }

    function firstDateOfMonth(){
		var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
		var firstDay = new Date(y, m, 1);
		return firstDay;
	}

    function lastDateOfMonth(){
		var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
		var lastDay = new Date(y, m + 1, 0);
		return lastDay;

    }

    useEffect(() => {
        const calculateEndDate = () => {
          if (startDate && duration) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(end.getDate() + parseInt(duration));
            // Mettre à jour l'interface utilisateur avec la date de fin
            setEndDate(end.toISOString().split("T")[0]);
            const reprDate = new Date(end);
            reprDate.setDate(end.getDate() + parseInt(1));
            setRepDate(reprDate.toISOString().split("T")[0]);
          }
        };
        calculateEndDate();
    }, [startDate, duration, repDate]);

    const handleFileChange = (setStateFunction) => (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = reader.result;
          setStateFunction(base64);
      }
      reader.readAsDataURL(file);
    }

    const savePermission = async (e) => {
        e.preventDefault();
        try {
            if (duration > nb_jours_permission) {
              setError("Vous ne pouvez pas dépassé le nombre de jours de permission disponible");
              setTimeout(() => {
                setError("");
              },7000)
              return;
            }
            if (selectedPerson.statut_personnel === "en congé") {
                setError("Ce personnel n'a pas droit à une permission car il est en congé");
                setTimeout(() => {
                    setError("");
                },7000)
                return;
            }
            if (lastPermission.length > 0) {
                let dur = 0;
                let fmd = firstDateOfMonth();
                let lmd = lastDateOfMonth();
                for (let i = 0; i < lastPermission.length; i++) {
                    if ((lastPermission[i].date_debut_permission >= fmd && lastPermission[i].date_debut_permission <= lmd) && (lastPermission[i].date_fin_permission >= fmd && lastPermission[i].date_fin_permission <= lmd)) {
                        dur += lastPermission[i].duree_permission;
                    }
                    if ((startDate >= lastPermission[i].date_debut_permission.toISOString().slice(0,19).replace('T',' ') && startDate <= lastPermission[i].date_fin_permission.toISOString().slice(0,19).replace('T',' ')) || (endDate >= lastPermission[i].date_debut_permission.toISOString().slice(0,19).replace('T',' ') && endDate <= lastPermission[i].date_fin_permission.toISOString().slice(0,19).replace('T',' '))) {
                        setError("Vous avez déja pris une permission pour cette période");
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                }
                console.log("durée dernières permission : " ,dur);
                if (dur === 3) {
                    setError("Vous avez epuisé vos permsissions pour ce mois");
                    setTimeout(() => {
                      setError("");
                    },7000)
                    return;
                }
                if (dur < 3) {
                    setStatus(`${sexe === 'M' ? 'M' : 'Mme'} ${name} a encore droit à ${3 - dur > 0 ? 3 - dur + " jours de permissions" : 3 - dur + "jour permission"}`)
                    if (duration > (3 - dur)) {         
                        setError(`${sexe === 'M' ? 'M' : 'Mme'} ${name} a encore droit à ${3 - dur > 0 ? 3 - dur + " jours de permissions" : 3 - dur + "jour permission"}`);
                        setTimeout(() => {
                            setError("");
                        },7000)
                        return;
                    }
                }
            }
            if (duration > 3) {
                setError("Vous n'avez droit qu'a 3 jours de permissions par mois");
                setTimeout(() => {
                  setError("");
                },7000)
                return;
            }
            if (name === "" || startDate === "" || endDate === "" || duration === "" || repDate === "" || matricule === "" || type === "" || structure === "" || poste === "") {
                setError('Veuillez remplir tous les champs');
                setTimeout(() => {
                    setError("");
                }, 7000)
                return;
            } else {
              const attestation = {
                name: name,
                matricule: matricule,
                sexe: sexe,
                poste: poste.replace("'", "`"), 
                type: type, 
                duration: duration,
                structure: structure.replace("'", "`"),
                startDate: startDate,
                endDate: endDate,
                repriseDate: repDate,
              }
              const permission_data = {
                startDate : startDate,
                endDate : endDate,
                duration : duration,
                id_personnel: selectedPerson.id_personnel,
                curr_date : new Date().toISOString().slice(0,19).replace('T',' '),
                demande : demande,
                document : document,
                statut_permission : "non archivé"
              }
                const req_permission = `INSERT INTO permission 
                  (date_debut_permission, date_fin_permission, duree_permission, created_at_permission,attestation_permission,id_personnel,demande_permission,statut_permission) 
                  VALUES ("${permission_data.startDate}","${permission_data.endDate}",${permission_data.duration},"${permission_data.curr_date}",'${JSON.stringify(attestation)}',${permission_data.id_personnel},"${permission_data.demande}","${permission_data.statut_permission}");`;
                const statut = curr_date >= permission_data.startDate && curr_date <= permission_data.endDate ? "en permission" : "en poste";
                const req_personnel = `UPDATE personnel SET statut_personnel = "${statut}",nb_jours_permission = (nb_jours_permission - ${duration}) WHERE id_personnel = ${permission_data.id_personnel};`;
                window.electronAPI.addPermission(req_permission);
                setSuccess("permission ajoutée avec succès");
                setStatus(`Le satut de ${sexe === 'M' ? 'M' : 'Mme'} ${name} a été mis à jour !`);
                window.electronAPI.updatePersonnel(req_personnel);
                /*window.electronAPI.permissionAddedSuccess(() => {
                    console.log("permission ajouter avec succès");
                });*/
                setTimeout(() => {
                    setSuccess("");
                }, 3000)
            }
        } catch (error) {
            console.error("Erreur saving permission : " + error.message);
        }
    } 
    /** useeffect for fetching */
    useEffect(() => {
        const func = async () => {
            try {
                const last_permission_req = `SELECT * FROM permission WHERE id_personnel = ${id_personnel}`;
                window.electronAPI.getLastPermission(last_permission_req);
                await window.electronAPI.retrieveLastPermission((event, res) => {
                    console.log("lasts permissions : ", res);
                    setLastPermission(res);
                })
                window.electronAPI.getPermission();
                await window.electronAPI.retrievePermission((event, res) => {
                    setPermission(res);
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, [id_personnel]);


    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        {/* Tableaux de Conges */}
        <Row>
            <div className="col p-0">
                <div className="col">
                    <Card className="shadow">
                        <CardHeader className="bg-white border-0">
                            <h3 className="mb-0 text-center">Listes des Permission</h3>
                        </CardHeader>
                        <Row>
                            <Col lg="12">
                                {deleteSuccess && 
                                    <Alert className="text-center" color="success">
                                        {deleteSuccess}
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th>Matricule</th>
                                    <th>Nom</th>
                                    <th>Date de debut</th>
                                    <th>Date de fin</th>
                                    <th>Nombre de jours restant</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permission.map((p, index) => (
                                    <tr key={index}>
                                        <td>{p.matricule_personnel}</td>    
                                        <td>{p.nom_prenom_personnel}</td>    
                                        <td>{p.date_debut_permission.getFullYear() + "-" + (parseInt(p.date_debut_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_debut_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "-" + p.date_debut_permission.getDate()}</td>
                                        <td>{p.date_fin_permission.getFullYear() + "-" + (parseInt(p.date_fin_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_fin_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "-" + p.date_fin_permission.getDate()}</td>
                                        <td>{curr_date >= p.date_debut_permission && curr_date <= p.date_fin_permission ? Math.ceil((p.date_fin_permission - curr_date) / (1000 * 3600 * 24)) : Math.ceil((p.date_fin_permission - p.date_debut_permission)/ (1000 * 3600 * 24)) }</td>
                                        <td>{curr_date >= p.date_debut_permission && curr_date <= p.date_fin_permission 
                                            ? <Badge color="success">
                                                en cours
                                              </Badge>
                                            : <Badge color="warning">
                                                programmé
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
                                                      onClick={() => editPermission(p)}
                                                      disabled
                                                    >
                                                      Modifier la permission
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      onClick={() => deletePermission(p)}
                                                    >
                                                        Annuler la permission
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      disabled={curr_date >= p.date_debut_permission && curr_date <= p.date_fin_permission ? false : true}
                                                      onClick={() => stopPermission(p)}
                                                    >
                                                        Arreter la permission
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
                                    { success && 
                                        <Alert color="success">
                                            {success}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Button
                                        color="primary"
                                        onClick={(e) => savePermission(e)}
                                        disabled={selectedPerson ? false : true}
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
                            name={name}
                            matricule={matricule}
                            sexe={sexe}
                            type={type}
                            poste={poste}
                            duration={duration} 
                            structure={structure}
                            startDate={startDate}
                            endDate={endDate}
                            repriseDate={repDate}
                        />
                    </PDFViewer>
                </Col>
                <Col md="12">
                <PDFDownloadLink document={<PermissionDoc 
                    name={name}
                    matricule={matricule}
                    sexe={sexe}
                    type={type}
                    poste={poste}
                    duration={duration} 
                    structure={structure}
                    startDate={startDate}
                    endDate={endDate}
                    repriseDate={repDate}
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