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
    Alert,
    Input,
    Button,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";

const ArchiveAttestationRepPermission = () => {

    const [archiveAttRepPermission, setArchiveAttRepPermission] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState("");
    const [deleteArchive, setDeleteArchive] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";

    const filterArchiveAttRepPermission = search !== ""
    ? archiveAttRepPermission.filter(archive_att_conge => (
        archive_att_conge.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) || archive_att_conge.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : archiveAttRepPermission

    
    const [perPage] = useState(100);
    const pageCount = Math.ceil(archiveAttRepPermission ? archiveAttRepPermission.length/perPage : 0/perPage);
    const offset = pageNumber * perPage;

    /** some useful functions */

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }    

    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    } 

    const handleArchiveDelete = (arch) => {
        const req = `DELETE FROM archive_att_reprise_permission WHERE id_arch_att_rep_permission = ${arch.id_arch_att_rep_permission}`;
        const req_conge = `UPDATE permission SET statut_att_reprise_permission ="non archivé" WHERE id_permission = ${arch.id_arch_att_rep_permission}`;
        window.electronAPI.deleteArchiveAttRepPermission(req);
        window.electronAPI.deleteArchiveAttRepPermissionSuccess(() => {
            setDeleteArchive("Archive Supprimser avec succès");
            setTimeout(() => {
                setDeleteArchive("");
            }, 3000)
        })
        window.electronAPI.updateConge(req_conge);
        window.electronAPI.updateCongeSuccess((event, res) => {
            console.log("permission mis à jour avec succès");
        });
        handleRefresh();
    }

    const fetchDatas = async () => {
        try {
            window.electronAPI.getArchiveAttRepPermission();
            await window.electronAPI.retrieveArchiveAttRepPermission((event, res) => {
                setArchiveAttRepPermission(res);
                setTimeout(() => 
                setLoadingSpinner(false)
                , 3000);
            })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }

    /** useeffect for common function and fetching */
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
            {/* Table */}
            <Row>
                <Col lg="12" md="12">
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
                <Col g="12" md="12">
                    { deleteArchive && (
                        <Alert color="success">
                            {deleteArchive}
                        </Alert>
                    )}                                                                                    
                </Col>
                <Col className="p-0" lg="12" md="12">
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="bg-white border-2 d-flex justify-content-center">
                                    <h3 className="mb-0 text-center">Listes des Attestations de Reprise après Permission Archivées</h3> 
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
                                            <th>Archive</th>
                                            <th>Date archivage</th>
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
                                        {filterArchiveAttRepPermission && filterArchiveAttRepPermission.length > 0 ? !loadingSpinner &&  (filterArchiveAttRepPermission.slice(offset, offset + perPage).map((archive, index) => (
                                            <tr key={index}>
                                                <td>{archive.matricule_personnel}</td>    
                                                <td>{archive.nom_prenom_personnel}</td>
                                                <td>
                                                    {
                                                        <a
                                                            color="success"
                                                            href={archive.fichier_arch_att_rep_permission}
                                                            download={`archive_attestation_reprise_de_fonction_${archive.matricule_personnel}.jpg`}
                                                        >
                                                            Télécharger l'archive 
                                                        </a>
                                                    }
                                                </td> 
                                                <td>{archive.created_at_arch_att_rep_permission.getFullYear() + "-" + (parseInt(archive.created_at_arch_att_rep_permission.getMonth()+1) <= 9 ? "0"+parseInt(archive.created_at_arch_att_rep_permission.getMonth()+1) : parseInt(archive.created_at_arch_att_rep_permission.getMonth()+1)) + "-" + archive.created_at_arch_att_rep_permission.getDate()}</td> 
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
                                                                onClick={() => handleArchiveDelete(archive)}
                                                            >
                                                                Supprimer ce document
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        )))
                                        : 
                                            !loadingSpinner && (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        {loadingText}
                                                    </td>
                                                </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Card>
                        </div>
                </Col>
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


export default ArchiveAttestationRepPermission;