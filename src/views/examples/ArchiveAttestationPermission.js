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

const ArchiveAttestationPermission = () => {

    const [archive_permission, setArchivePermission] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [search, setSearch] = useState("");
    const pageCount = Math.ceil(archive_permission.length/perPage);
    const offset = pageNumber * perPage;
    const [deleteArchive, setDeleteArchive] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";

    const filterArchivePermission = search !== ""
    ? archive_permission.filter(attestation_conge => (
        archive_permission.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) || archive_permission.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : archive_permission

    /** some useful functions */

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }    

    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    } 

    const handleArchiveDelete = (arch) => {
        console.log(arch);
        const req = `DELETE FROM archive_att_permission WHERE id_arch_att_permission  = ${arch.id_arch_att_permission}`;
        const req_conge = `UPDATE permission SET statut_attestation_permission ="non archivé" WHERE id_permission = ${arch.id_permission}`;
        window.electronAPI.deleteArchiveAttPermission(req);
        window.electronAPI.deleteArchiveAttPermissionSuccess(() => {
            setDeleteArchive("Archive Supprimser avec succès");
            setTimeout(() => {
                setDeleteArchive("");
            }, 7000)
        })
        window.electronAPI.updateConge(req_conge);
        window.electronAPI.updateCongeSuccess((event, res) => {
            setDeleteArchive("permission mis à jour avec succès")
            setTimeout(() => {
                setDeleteArchive("");
            }, 7000)
        });
    }

    /** useeffect for common function and fetching */

    const fetchDatas = async () => {
        try {
            window.electronAPI.getArchiveAttPermission();
            await window.electronAPI.retrieveArchiveAttPermission((event, res) => {
                console.log("archives : " + res);
                setArchivePermission(res);
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
            {/* Table */}
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
            <Row className="mt-3">
                <Col>
                    { deleteArchive && (
                        <Alert color="success">
                            {deleteArchive}
                        </Alert>
                    )}                                                                                    
                </Col>
            </Row>
            <Row>
                <div className="col p-0">
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="bg-white border-2 d-flex justify-content-center">
                                    <h3 className="mb-0 text-center">Listes des Attestations de Permission Archivées</h3>
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
                                        {filterArchivePermission && filterArchivePermission.length > 0 ? !loadingSpinner && (filterArchivePermission.slice(offset, offset + perPage).map((archive, index) => (
                                            <tr key={index}>
                                                <td>{archive.matricule_personnel}</td>    
                                                <td>{archive.nom_prenom_personnel}</td>
                                                <td>
                                                    {
                                                        <a
                                                            color="success"
                                                            href={archive.fichier_arch_att_permission}
                                                            download={`archive_attestation_${archive.matricule_personnel}.jpg`}
                                                        >
                                                            Télécharger l'archive 
                                                        </a>
                                                    }
                                                </td> 
                                                <td>{archive.created_at_arch_permission.getFullYear() + "-" + (parseInt(archive.created_at_arch_permission.getMonth()+1) <= 9 ? "0"+parseInt(archive.created_at_arch_permission.getMonth()+1) : parseInt(archive.created_at_arch_permission.getMonth()+1)) + "-" + archive.created_at_arch_permission.getDate()}</td> 
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

export default ArchiveAttestationPermission;