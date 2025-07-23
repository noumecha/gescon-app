import { useState, React } from 'react';
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
import filterPersonnel from 'utils/filterPersonnel';
import usePagination from 'hooks/usePagination';
import { formatDateMonthForm } from 'utils/dates-utils';
import { deleteConge } from 'utils/deleteConge';
import { leftDays } from 'utils/calculs-utils';

const CongesTable = ({
    loadingText, 
    saveAttestationRepConge, 
    loadingSpinner,
    handleStatutFilter,
    statutFilter,
    handleSearch,
    search,
    generateSuccess,
    handleRefresh,
    conge, 
    setSuccess,
    setError,
    setStatus,
    handleEditConge,
}) => {

    const [perPage] = useState(100);

    const filterConge = filterPersonnel(conge, search, statutFilter, "conge");

    const { pageNumber, pageCount, handlePageChange, currentPageData, offset, handlePagePrev, handlePageNext } = usePagination(filterConge, perPage);

    /*const leftDays = (startDate, endDate, attestation) => {
        let leftDays
        let typePersonnel = JSON.stringify(attestation.type)
        const curr_date = new Date();
        if (curr_date >= startDate && curr_date <= endDate) {
            if (typePersonnel === "Contractuelle") {
                let weekdaysToAdd = Math.ceil((endDate - curr_date) / (1000 * 3600 * 24)) - 1;
                while (weekdaysToAdd > 0) {
                    endDate.setDate(endDate.getDate() + parseInt(1));
                    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
                        weekdaysToAdd--;
                    }
                }
                leftDays = Math.ceil((endDate - curr_date) / (1000 * 3600 * 24));
            } else {
                leftDays = Math.ceil((endDate - curr_date) / (1000 * 3600 * 24));
            }
        } else {
            if (typePersonnel === "Contractuelle") {
                let weekdaysToAdd =  leftDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) - 1;
                while (weekdaysToAdd > 0) {
                    startDate.setDate(startDate.getDate() + parseInt(1));
                    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
                        weekdaysToAdd--;
                    }
                }
                leftDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24))
            } else {
                leftDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24))
            }
        }
        return leftDays
    }*/

    const handleDeleteConge = (c) => {
        deleteConge(c, setSuccess, setError, setStatus);
    }

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
                        <option value="annulé">annulé</option>
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
                            {   filterConge && filterConge.length > 0 ? !loadingSpinner && currentPageData.map((c, index) => (
                                    <tr key={index}>
                                        <td>{c.matricule_personnel}</td>    
                                        <td>{c.nom_prenom_personnel}</td> 
                                        <td>{c.date_debut_conge.getDate() + "/" + formatDateMonthForm(c.date_debut_conge) + "/" + c.date_debut_conge.getFullYear() }</td>
                                        <td>{c.date_fin_conge.getDate() + "/" + formatDateMonthForm(c.date_fin_conge) + "/" + c.date_fin_conge.getFullYear()}</td>
                                        <td>{c.statut_conge === "programmé" ? c.attestation_conge.duration : c.statut_conge !== "terminé" ? leftDays(c.date_debut_conge, c.date_fin_conge, c.attestation_conge) : 0 }</td>
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
                                                    <DropdownItem
                                                        onClick={() => handleEditConge(c)}
                                                        disabled={c.statut_conge === "annulé" ? true : false}
                                                    >
                                                        Modifier
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => handleDeleteConge(c)}
                                                        disabled={c.statut_conge === "annulé" ? true : false}
                                                    >
                                                        Supprimer/annuler
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                ))
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