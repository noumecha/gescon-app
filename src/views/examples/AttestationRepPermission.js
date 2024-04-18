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
import ReprisePermissionDoc from "documents/ReprisePermissionDoc";

const AttestationRepPermission = () => {

    const [attestation_rep_permission, setAttestationPermission] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState(""); 
    const [modalData, setModalData] = useState(null); 
    const [modal, setModal] = useState(false);
    const [errorArchive, setErrorArchive] = useState("");
    const [successArchive, setSuccessArchive] = useState("");
    const [archive, setArchive] = useState(null);

    // usefull functions : 

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleRowClick = (att_perm) => {
        setModalData(att_perm);
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

    const saveArchive = async (attestation_rep_permission) => {
        if (!archive) {
            setErrorArchive("Veuillez sélectionner un fichier");
            setTimeout(() => {
            setErrorArchive("");
            }, 7000)
            return;
        }
        const date = new Date().toISOString().slice(0,19).replace('T',' ');
        const req = `INSERT INTO  archive_att_reprise_permisison (fichier_arch_att_rep_permission,created_at_arch_att_rep_permission,id_permission) VALUES ("${archive}","${date}",${attestation_rep_permission.id_permission}) `;
        const req_conge = `UPDATE permission SET statut_att_reprise_permission ="archivé" WHERE id_permission = ${attestation_rep_permission.id_permission}`;
        window.electronAPI.addArchiveAttestationPermission(req)
        window.electronAPI.addArchiveAttPermissionSuccess((event, res) => {
            setSuccessArchive("attestation archivé avec succès")
            setTimeout(() => {
                setSuccessArchive("");
            }, 7000)
        })
        window.electronAPI.updatePermission(req_conge);
        window.electronAPI.updatePermissionSuccess((event, res) => {
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
    const pageCount = Math.ceil(attestation_rep_permission.length/perPage);
    const offset = pageNumber * perPage;
    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    }

    /** Filter */

    const filterAttestation = filter !== "" || search !== ""
    ? attestation_rep_permission.filter(attestation_rep_permission => attestation_rep_permission.statut_attestation_rep_permission === filter && (
        attestation_rep_permission.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) || attestation_rep_permission.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : attestation_rep_permission

    /** useeffect for common function and fetching */
    useEffect(() => {
        const func = async () => {
            try {
                window.electronAPI.getAttestationPermission();
                await window.electronAPI.retrieveAttestationPermission((event, res) => {
                    for (let index = 0; index < res.length; index++) {
                        res[index].attestation_rep_permission = JSON.parse(res[index].attestation_rep_permission)                                                
                    }
                    setAttestationPermission(res);
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, []);

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
                        <option value="">Tout les statut</option>
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
                    {attestation_rep_permission && attestation_rep_permission.length > 0 ? (
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0 text-center">Listes des Attestations de Permission</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Matricule</th>
                                            <th>Nom & Prenom</th>
                                            <th>Attestation</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterAttestation.slice(offset, offset + perPage).map((att_perm, index) => (
                                            <tr key={index}>
                                                <td>{att_perm.matricule_personnel}</td>    
                                                <td>{att_perm.nom_prenom_personnel}</td>
                                                <td>
                                                    <PDFDownloadLink document={<ReprisePermissionDoc 
                                                        name={att_perm.attestation_reprise_permission.name} 
                                                        matricule={att_perm.attestation_reprise_permission.matricule}
                                                        sexe={att_perm.attestation_reprise_permission.sexe}
                                                        poste={att_perm.attestation_reprise_permission.poste}
                                                        duration={att_perm.attestation_reprise_permission.duration}
                                                        structure={att_perm.attestation_reprise_permission.structure}
                                                        startDate={att_perm.attestation_reprise_permission.startDate}
                                                        endDate={att_perm.attestation_reprise_permission.endDate}
                                                        repriseDate={att_perm.attestation_reprise_permission.repriseDate}
                                                    />} fileName={`attestation_${att_perm.matricule_personnel}.pdf`}>
                                                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                                                        <Button
                                                            color="success"
                                                        >
                                                            Télécharger l'attestation 
                                                        </Button>)}
                                                    </PDFDownloadLink>
                                                </td> 
                                                <td>
                                                    {att_perm.statut_att_reprise_permission === "non archivé" ?  
                                                        <Badge color="danger">
                                                            {att_perm.statut_att_reprise_permission}
                                                        </Badge> 
                                                        : att_perm.statut_att_reprise_permission === "archivé" ? 
                                                        <Badge color="success">
                                                            {att_perm.statut_att_reprise_permission}
                                                        </Badge> 
                                                        : 
                                                        <Badge color="danger">
                                                            {att_perm.statut_att_reprise_permission}
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
                                                                onClick={() => handleRowClick(att_perm)}
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
                                                                                            Attestation de reprise permission signé
                                                                                        </Label>
                                                                                        <Input
                                                                                            id="demande-file"
                                                                                            name="file"
                                                                                            type="file"
                                                                                            accept=".jpeg, .png, .jpg, .pdf"
                                                                                            onChange={(e) => handleArchiveChange(e)}
                                                                                        />
                                                                                        <FormText>
                                                                                            selectionner l'attestion signé à archivé (fichier accepté .jpeg, .png, .jpg, .pdf)
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
                                                                                                console.log("current archive : " + att_perm.nom_prenom_personnel)
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
                                        ))}
                                    </tbody>
                                </Table>
                            </Card>
                        </div>
                    ) : (  
                        <div className="col">  
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0 text-center"> Aucune attestation dans la base de données </h3>
                                </CardHeader>
                            </Card>
                        </div>
                    )}
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

export default AttestationRepPermission;