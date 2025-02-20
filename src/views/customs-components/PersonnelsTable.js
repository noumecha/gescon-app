import React from 'react';
import { 
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem,
    Table,
    Card,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    CardBody,
    Form,
    FormGroup,
    Label,
    Badge,
    Row,
    CardHeader,
    Alert,
    Input,
    Button,
} from 'reactstrap';

const PersonnelsTable = ({
    loadingSpinner,
    filterPersonnel,
    loadingText,
    modal,
    toggleModal,
    saveDettPersonnel,
    selectedPerson,
    formatPersonnelName,
    dette,
    offset,
    handleDetteChange,
    errorDette,
    successDette,
    handleRefresh,
    handleCongeClick,
    handlePermissionClick,
    handleRowClick,
    handleDetailClick,
    perPage,
    modalData
}) => {
    return (
        <Row>
            <div className="col p-0">
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-2 d-flex justify-content-center">
                                <h3 className="mb-0 text-center">Listes du personnel </h3>
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
                                        {/*<th>Grade</th>*/}
                                        <th>Poste</th>
                                        {/*<th>Structure</th>*/}
                                        {/*<th>Sexe</th>*/}
                                        {/*<th>Date recrutement</th>*/}
                                        {/*<th>Situation Matrimoniale</th>*/}
                                        {/*<th>Region</th>*/}
                                        {/*<th>Departement</th>*/}
                                        {/*<th>Date de naissance</th>*/}
                                        {/*<th>Telephone</th>*/}
                                        <th>Categorie</th>
                                        {/*<th>Arrondissement</th>*/}
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
                                    {filterPersonnel && filterPersonnel.length > 0 ? !loadingSpinner && (filterPersonnel.slice(offset, offset + perPage).map((person, index) => (
                                        <tr key={index}>
                                            <td>{person.matricule_personnel}</td>    
                                            <td>{person.nom_prenom_personnel}</td>    
                                            {/*<td>{person.grade_personnel}</td>*/}    
                                            <td>{person.poste_personnel}</td>    
                                            {/*<td>{person.structure_personnel}</td>*/}    
                                            {/*<td>{person.sexe_personnel}</td>*/}
                                            {/*<td>{person.date_recrutement_personnel}</td>*/}    
                                            {/*<td>{person.situration_matrimoniale_personnel}</td>*/}    
                                            {/*<td>{person.region_personnel}</td>*/}    
                                            {/*<td>{person.departement_personnel}</td>*/}    
                                            {/*<td>{person.date_naiss_personnel}</td>*/}    
                                            {/*<td>{person.telephone_personnel}</td>*/}    
                                            <td>{person.categorie_personnel}</td>    
                                            {/*<td>{person._personnel}</td>*/} 
                                            <td>
                                                {person.statut_personnel === "en congé" ?  
                                                    <Badge color="danger">
                                                        {person.statut_personnel}
                                                    </Badge> 
                                                    : person.statut_personnel === "en poste" ? 
                                                    <Badge color="success">
                                                        {person.statut_personnel}
                                                    </Badge> 
                                                    : person.statut_personnel === "en permission" ?
                                                    <Badge color="primary">
                                                        {person.statut_personnel}
                                                    </Badge>
                                                    : 
                                                    <Badge color="danger">
                                                        {person.statut_personnel}
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
                                                            onClick={() => handleCongeClick(person)}
                                                            disabled={(person.nb_jours_conges + person.nb_jours_permission === 28 && person.id_type_personnel === 1) || (person.nb_jours_conges + person.nb_jours_permission === 40 && person.id_type_personnel === 2) ? true : false}
                                                        >
                                                            Nouveau congé
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => handlePermissionClick(person)}
                                                            disabled={(person.nb_jours_conges + person.nb_jours_permission === 28 && person.id_type_personnel === 1) || (person.nb_jours_conges + person.nb_jours_permission === 40 && person.id_type_personnel === 2) ? true : false}
                                                        >
                                                            Nouvelle permission
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => handleRowClick(person)}
                                                        >
                                                            Définir la dette
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => handleDetailClick(person)}
                                                        >
                                                            Détails
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
                            {/** modal implementation */}
                                
                            { modal && 
                            <Modal isOpen={modal} toggle={toggleModal} {...modalData}>
                                <ModalHeader toggle={toggleModal}>
                                    <Row>
                                        <Col>
                                            <h3 className="mb-0">Définir la dette de congé de {selectedPerson ? formatPersonnelName(selectedPerson) : ''}</h3>
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
                                                        for="dette"
                                                    >
                                                        Entrez le nombre de jours de congé dû (-moins de 3ans)
                                                    </Label>
                                                    <Input
                                                        id="dette"
                                                        name="dette"
                                                        type="number"
                                                        value={dette}
                                                        onChange={handleDetteChange}
                                                    />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <Button
                                                        color="success"
                                                        size="md"
                                                        onClick={() => saveDettPersonnel(modalData)}
                                                    >
                                                        Définir
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
                                                    { errorDette && (
                                                        <Alert color="danger">
                                                            {errorDette}
                                                        </Alert>
                                                    )}
                                                    { successDette && (
                                                        <Alert color="success">
                                                            {successDette}
                                                        </Alert>
                                                    )}                                                                                    
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </ModalBody>
                            </Modal>}
                        </Card>
                    </div>
            </div>
        </Row>
    ) ;
};

export default PersonnelsTable;