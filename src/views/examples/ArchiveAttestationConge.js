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

const ArchiveAttestationConge = () => {

    const [archive_conge, setArchiveConge] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [search, setSearch] = useState("");
    const pageCount = Math.ceil(archive_conge.length/perPage);
    const offset = pageNumber * perPage;
    const [deleteArchive, setDeleteArchive] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";

    const filterArchiveConge = search !== ""
    ? archive_conge.filter(archive_conge => (
        archive_conge.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) || archive_conge.matricule_personnel.toLowerCase().includes(search.toLowerCase())
    ))
    : archive_conge

    /** some useful functions */

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }    

    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    } 

    const handleArchiveDelete = (arch) => {
        console.log(arch);
        const req = `DELETE FROM archive_att_conge WHERE id_archive_att_conge = ${arch.id_archive_att_conge}`;
        const req_conge = `UPDATE conge SET statut_attestation_conge ="non archivé" WHERE id_conge = ${arch.id_conge}`;
        window.electronAPI.deleteArchiveAttConge(req);
        window.electronAPI.deleteArchiveAttCongeSuccess(() => {
            setDeleteArchive("Archive Supprimser avec succès");
            setTimeout(() => {
                setDeleteArchive("");
            }, 7000)
        })
        window.electronAPI.updateConge(req_conge);
        window.electronAPI.updateCongeSuccess((event, res) => {
            setDeleteArchive("congé mis à jour avec succès")
            setTimeout(() => {
                setDeleteArchive("");
            }, 7000)
        });
    }

    /** useeffect for common function and fetching */
    const fetchDatas = async () => {
        try {
            window.electronAPI.getArchiveAttConge();
            await window.electronAPI.retrieveArchiveAttConge((event, res) => {
                setArchiveConge(res);
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
                                    <h3 className="mb-0 text-center">Listes des Attestations de Congés Archivées</h3>
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
                                        {filterArchiveConge && filterArchiveConge.length > 0 ? !loadingSpinner && (filterArchiveConge.slice(offset, offset + perPage).map((archive, index) => (
                                            <tr key={index}>
                                                <td>{archive.matricule_personnel}</td>    
                                                <td>{archive.nom_prenom_personnel}</td>
                                                <td>
                                                    {
                                                        <a
                                                            color="success"
                                                            href={archive.fichier_archive_att_conge}
                                                            download={`archive_attestation_${archive.matricule_personnel}.jpg`}
                                                        >
                                                            Télécharger l'archive 
                                                        </a>
                                                    }
                                                </td> 
                                                <td>{archive.created_at_arch_att_conge.getFullYear() + "-" + (parseInt(archive.created_at_arch_att_conge.getMonth()+1) <= 9 ? "0"+parseInt(archive.created_at_arch_att_conge.getMonth()+1) : parseInt(archive.created_at_arch_att_conge.getMonth()+1)) + "-" + archive.created_at_arch_att_conge.getDate()}</td> 
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
                                            </tr>)
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

export default ArchiveAttestationConge;