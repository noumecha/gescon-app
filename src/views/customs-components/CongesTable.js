import { useEffect, React } from 'react';
import { 
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem, 
    Table,
    Badge,
    Row,
    Col,
    Card,
    CardHeader,
    Alert,
    Input,
    Button,
} from 'reactstrap';
import MyPagination from './MyPagination';

const CongesTable = ({
    loadingText, 
    saveAttestationRepConge, 
    loadingSpinner, 
    pageCount, 
    handlePagePrev, 
    handlePageChange, 
    handlePageNext, 
    pageNumber,
    handleStatutFilter,
    statutFilter,
    handleSearch,
    search,
    generateSuccess,
    handleRefresh,
    filterConge,
    offset,
    perPage,
    formatDateMonthForm,
    curr_date,
}) => {
    return (
        <Row className='mt-3'>
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
            <Col lg="12">
                <Card className="shadow">
                    <Row>
                        <Col md="12" className="text-center">
                            {/* generateError && 
                            <Alert color="danger">
                                {generateError}
                            </Alert>
                            */}
                            { generateSuccess && 
                            <Alert color="success">
                                {generateSuccess}
                            </Alert>
                            }
                        </Col>
                    </Row>
                    <CardHeader className="bg-white border-2 d-flex justify-content-center">
                        <h3 className="mb-0 text-center">Listes des Congés</h3>
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
                                <span className="sr-only">Loading....</span>
                                </div>
                            </td>
                            </tr>
                        )}
                            {filterConge && filterConge.length > 0 ? !loadingSpinner && (filterConge.slice(offset, offset + perPage).map((c, index) => (
                                <tr key={index}>
                                    <td>{c.matricule_personnel}</td>    
                                    <td>{c.nom_prenom_personnel}</td> 
                                    <td>{c.date_debut_conge.getDate() + "/" + formatDateMonthForm(c.date_debut_conge) + "/" + c.date_debut_conge.getFullYear() }</td>
                                    <td>{c.date_fin_conge.getDate() + "/" + formatDateMonthForm(c.date_fin_conge) + "/" + c.date_fin_conge.getFullYear()}</td>
                                    <td>{c.statut_conge === "programmé" ? c.attestation_conge.duration : c.statut_conge !== "terminé" ? curr_date >= c.date_debut_conge && curr_date <= c.date_fin_conge ? Math.ceil((c.date_fin_conge - curr_date) / (1000 * 3600 * 24)) : Math.ceil((c.date_fin_conge - c.date_debut_conge)/ (1000 * 3600 * 24)) : 0 }</td>
                                    <td>{c.statut_conge === "en cours"
                                        ? <Badge color="success">
                                            {c.statut_conge}
                                        </Badge>
                                        : 
                                        c.statut_conge === "terminé"
                                        ?
                                        <Badge color="primary">
                                            {c.statut_conge}
                                        </Badge>
                                        :
                                        <Badge color="warning">
                                            {c.statut_conge}
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
                                                onClick={() => saveAttestationRepConge(c)}
                                                disabled={c.statut_conge === "terminé" ? false : true}
                                                >
                                                Générer l'attestation de reprise
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
                    {/** paginations */}
                    <MyPagination
                        pageCount={pageCount}
                        pageNumber={pageNumber}
                        handlePageChange={handlePageChange}
                        handlePagePrev={handlePagePrev}
                        handlePageNext={handlePageNext}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default CongesTable;