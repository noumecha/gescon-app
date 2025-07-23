import { React, useState } from "react";
import {
    Card,
    Button,
    CardHeader,
    Input,
    Col,
    Row,
    Alert,
    Badge,
    Table,
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem,
} from "reactstrap";
import filterPersonnel from "utils/filterPersonnel";
import MyPagination from "./MyPagination";
import usePagination from "hooks/usePagination";

const PersmissionsTable = ({
    handleStatutFilter,
    statutFilter,
    handleSearch,
    search,
    success,
    handleRefresh,
    loadingSpinner,
    curr_date,
    saveAttestationRepPermission,
    loadingText,
    permission
}) => {
    const [perPage] = useState(100);

    // filtering permission
    const filterPermission = filterPersonnel(permission, search, statutFilter, "permission")
    
    const { pageNumber, pageCount, currentPageData, handlePageChange, handlePagePrev,offset, handlePageNext } = usePagination(filterPermission, perPage);

    return (
        <Row>
            <Col lg="12">
                <Card>
                    <CardHeader>
                    <Row>
                        <Col lg="6">
                        <Input
                            type="select"
                            className="form-control mt-2"
                            onChange={handleStatutFilter}
                            value={statutFilter}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="programmé">programmé</option>
                            <option value="en cours">en cours</option>
                            <option value="terminé">terminé</option>
                        </Input>
                        </Col>
                        <Col lg="6">
                        <Input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Rechercher par nom ou matricule"
                            onChange={handleSearch}
                            value={search}
                        />
                        </Col>
                    </Row>
                    </CardHeader>
                </Card>
            </Col>
            <div className="col p-0">
                <div className="col">
                    <Card className="shadow">
                        <Row>
                            <Col lg="12">
                                { success && 
                                    <Alert className="text-center" color="success">
                                        {success}
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <CardHeader className="bg-white border-2 d-flex justify-content-center">
                            <h3 className="mb-0 text-center">Listes des Permissions</h3>
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
                                    <th>Nom</th>
                                    <th>Date de debut</th>
                                    <th>Date de fin</th>
                                    <th>Nombre de jours restant</th>
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
                                {filterPermission && filterPermission.length > 0 ? !loadingSpinner && (filterPermission.slice(offset, offset + perPage).map((p, index) => (
                                    <tr key={index}>
                                        <td>{p.matricule_personnel}</td>    
                                        <td>{p.nom_prenom_personnel}</td>    
                                        <td>{p.date_debut_permission.getDate() + "/" + (parseInt(p.date_debut_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_debut_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "/" + p.date_debut_permission.getFullYear()}</td>
                                        <td>{p.date_fin_permission.getDate() + "/" + (parseInt(p.date_fin_permission.getMonth()+1) <= 9 ? "0"+parseInt(p.date_fin_permission.getMonth()+1) : parseInt(p.date_fin_permission.getMonth()+1)) + "/" + p.date_fin_permission.getFullYear()}</td>
                                        <td>{p.statut_permission !== "terminé" ? curr_date >= p.date_debut_permission && curr_date <= p.date_fin_permission ? Math.ceil((p.date_fin_permission - curr_date) / (1000 * 3600 * 24)) : Math.ceil((p.date_fin_permission - p.date_debut_permission)/ (1000 * 3600 * 24) + 1) : 0 }</td>
                                        <td>{p.statut_permission === "en cours"
                                            ? <Badge color="success">
                                                {p.statut_permission}
                                            </Badge>
                                            : 
                                                p.statut_permission === "terminé"
                                            ?
                                                <Badge color="primary">
                                                    {p.statut_permission}
                                                </Badge>
                                            :
                                                <Badge color="warning">
                                                    {p.statut_permission}
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
                                                        onClick={() => saveAttestationRepPermission(p)}
                                                        disabled={p.statut_permission === "terminé" ? false : true}
                                                    >
                                                        Générer l'attestation de reprise
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
                        {/** paginations */}
                        <MyPagination
                            pageCount={pageCount}
                            pageNumber={pageNumber}
                            handlePageChange={handlePageChange}
                            handlePagePrev={handlePagePrev}
                            handlePageNext={handlePageNext}
                        />
                    </Card>
                </div>
            </div>
        </Row>
    );
}

export default PersmissionsTable;