import {
    Container,
    Row,
    Card,
    CardHeader,
    Table,
    DropdownItem,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    CardFooter,
    Pagination,
    PaginationLink,
    PaginationItem,
    Col,
    Input,
    Button,
    Badge,
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
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CongeDoc from "documents/CongeDoc";

const AttestationConge = () => {

    const [attestation_conge, setAttestationConge] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [modalData, setModalData] = useState(null); 
    const [modal, setModal] = useState(false);
    const [errorArchive, setErrorArchive] = useState("");
    const [successArchive, setSuccessArchive] = useState("");
    const [archive, setArchive] = useState(null);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";

    // usefull functions : 

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleRowClick = (att_con) => {
        setModalData(att_con);
        toggleModal();
    };

    const handleArchiveChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            setArchive(base64);
        }
        reader.readAsDataURL(file);
    };

    const saveArchive = async (attestation_conge) => {
        if (!archive) {
            setErrorArchive("Veuillez sélectionner un fichier");
            setTimeout(() => {
              setErrorArchive("");
            }, 7000)
            return;
        }
        const date = new Date().toISOString().slice(0,19).replace('T',' ');
        const req = `INSERT INTO archive_att_conge (fichier_archive_att_conge,created_at_arch_att_conge,id_conge) VALUES ("${archive}","${date}",${attestation_conge.id_conge}) `;
        const req_conge = `UPDATE conge SET statut_attestation_conge ="archivé" WHERE id_conge = ${attestation_conge.id_conge}`;
        window.electronAPI.addArchiveAttestationConge(req)
        window.electronAPI.addArchiveAttCongeSuccess((event, res) => {
            setSuccessArchive("attestation archivé avec succès")
            setTimeout(() => {
                setSuccessArchive("");
            }, 7000)
        })
        window.electronAPI.updateConge(req_conge);
        window.electronAPI.updateCongeSuccess((event, res) => {
            setSuccessArchive("congé mis à jour avec succès")
            setTimeout(() => {
                setSuccessArchive("");
            }, 7000)
        });
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    /** for the pagination */
    const pageCount = Math.ceil(attestation_conge.length/perPage);
    const offset = pageNumber * perPage;
    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    }

    /** Filter */

    const filterAttestation = filter !== "" || search !== ""
    ? attestation_conge.filter(attestation_conge => attestation_conge.statut_attestation_conge === filter && (
        attestation_conge.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) 
        || attestation_conge.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : attestation_conge

    /** useeffect for common function and fetching */

    const fetchDatas = async () => {
        try {
            window.electronAPI.getAttestationConge();
            await window.electronAPI.retrieveAttestationConge((event, res) => {
                for (let index = 0; index < res.length; index++) {
                    res[index].attestation_conge = JSON.parse(res[index].attestation_conge)
                }
                setAttestationConge(res);
                setTimeout(() => 
                setLoadingSpinner(false)
                , 3000);
            })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }

    useEffect(() => {
        fetchDatas();
    }, []);
    
    const handleRefresh = () => {
        try {
          setLoadingSpinner(true);
          setTimeout(() => 
          setLoadingSpinner(false)
          , 3000);
          fetchDatas();
          console.log("datas refreshed successfully");
        } catch (err) {
          console.error("error on refresh : " + err.message);
        }
    }

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid> 
            <Row>
                <Col lg="12">
                    <Input
                        type="select"
                        className="form-control"
                        onChange={handleFilterChange}
                        value={filter}
                    >
                        <option value="">Tout les status</option>
                        <option value="archivé">archivé</option>
                        <option value="non archivé">non archivé</option>
                    </Input>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <div className="form-group custom-form">
                        <Input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Rechercher par nom ou matricule"
                            onChange={handleSearch}
                            value={search}
                        />
                    </div>
                </Col>
            </Row>
            {/* Table */}
            <Row>
                <div className="col p-0">
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="bg-white border-2 d-flex justify-content-center">
                                    <h3 className="mb-0 text-center">Listes des Attestations de Congés</h3>
                                    <Button
                                        size="sm"
                                        className="ml-3"
                                        onClick={() => handleRefresh()}
                                    >
                                        Actualiser
                                    </Button>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Matricule</th>
                                            <th>Nom & Prenom</th>
                                            <th>Attestation</th>
                                            <th>Date de création</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingSpinner && (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            </td>
                                        </tr>
                                        )}
                                        {filterAttestation && filterAttestation.length > 0 ? !loadingSpinner && (filterAttestation.slice(offset, offset + perPage).map((att_con, index) => (
                                            <tr key={index}>
                                                <td>{att_con.matricule_personnel}</td>    
                                                <td>{att_con.nom_prenom_personnel}</td>
                                                <td>
                                                    <PDFDownloadLink document={<CongeDoc 
                                                        name={att_con.attestation_conge.name} 
                                                        matricule={att_con.attestation_conge.matricule}
                                                        sexe={att_con.attestation_conge.sexe}
                                                        poste={att_con.attestation_conge.poste}
                                                        type={att_con.attestation_conge.type}
                                                        decision={att_con.attestation_conge.decision}
                                                        duration={att_con.attestation_conge.duration}
                                                        structure={att_con.attestation_conge.structure}
                                                        startDate={att_con.attestation_conge.startDate}
                                                        endDate={att_con.attestation_conge.endDate}
                                                        repriseDate={att_con.attestation_conge.repriseDate}
                                                        typeConge={att_con.attestation_conge.typeConge}
                                                        preposition={att_con.attestation_conge.preposition}
                                                        grade={att_con.attestation_conge.grade}
                                                        nb_jour_conges_restant={att_con.attestation_conge.nb_jour_conges_restant}
                                                        numero_conge_admin={att_con.attestation_conge.numero_conge_admin}
                                                    />} fileName={`attestation_conge_${att_con.nom_prenom_personnel}_du_${att_con.attestation_conge.startDate}_au_${att_con.attestation_conge.endDate}.pdf`}>
                                                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                                                        <Button
                                                            color="success"
                                                        >
                                                            Télécharger l'attestation 
                                                        </Button>)}
                                                    </PDFDownloadLink>
                                                </td>
                                                <td>
                                                    {att_con.attestation_conge.created_at}
                                                </td>
                                                <td>
                                                    {att_con.statut_attestation_conge === "non archivé" ?  
                                                        <Badge color="danger">
                                                            {att_con.statut_attestation_conge}
                                                        </Badge> 
                                                        : att_con.statut_attestation_conge === "archivé" ? 
                                                        <Badge color="success">
                                                            {att_con.statut_attestation_conge}
                                                        </Badge> 
                                                        : 
                                                        <Badge color="danger">
                                                            {att_con.statut_attestation_conge}
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
                                                                onClick={() => handleRowClick(att_con)}
                                                            >
                                                                Archiver ce document
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
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        ))) : 
                                            !loadingSpinner && (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        {loadingText}
                                                    </td>
                                                </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card>
                        </div>
                </div>
            </Row>
            <Row className="m-0">
                <CardFooter className="py-4">
                    <nav aria-label="...">
                        <Pagination
                            className="pagination justify-content-center"
                            listClassName="justify-content-center"
                        >
                            {Array.from({length: pageCount}, (_, i) => (
                                <PaginationItem key={i} active={i === pageNumber}>
                                    <PaginationLink onClick={() => handlePageChange({selected: i})}>
                                        {i}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </Pagination>
                    </nav>
                </CardFooter>
            </Row>
        </Container>
      </>
    );
}

export default AttestationConge;