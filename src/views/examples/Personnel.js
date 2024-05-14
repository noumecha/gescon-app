/* eslint-disable no-unused-vars */
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    NavItem,
    NavLink,
    Input,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    Col,
    Alert,
    Nav,
    UncontrolledTooltip,
    Button,
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import PersonnelDetails from "./PersonnelDetails";

const Personnel = () => {

    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";
    const navigate = useNavigate();

    /** code for excel import */
    const handleFileSubmit = (e) => {
        e.preventDefault();
        if(excelFile!==null) {
            const workbook = XLSX.read(excelFile, {type: 'base64'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data);
        } else {
            setTypeError("Veuillez selectionner un fichier Excel");
        }
    }

    const handleFile = (e) => {
        let fileTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ]
        let selectedFile = e.target.files[0];
        if(selectedFile) {
            if(selectedFile&&fileTypes.includes(selectedFile.type)){
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                }
            } else {
                setTypeError("Veuillez selectionner un fichier Excel");
                setExcelFile(null);
            }
        } else {
            console.log("Please select a file");
        }
    } 

    /** add personnel to the db */
    const addPersonnel = async () => {
        try {
            for (let i = 0; i < excelData.length; i++) {
                const type = ['A2','A1','B1','B2','C','D'].includes(excelData[i].CATEGORIE) ? 1 : 2;
                const statut = "en poste"; // en permission, en congé
                //const nb_jours_conges = ['A2','A1','B1','B2','C','D'].includes(excelData[i].CATEGORIE) ? 30 : 18;
                const nb_jours_conges = 0;
                const nb_jours_permission = 0;
                const next_month_permission = {
                    month: 0,
                    amount: 0,
                }
                const req = `
                INSERT INTO personnel 
                (ordre_personnel, matricule_personnel, nom_prenom_personnel, grade_personnel, poste_personnel, structure_personnel, cellule_personnel, sexe_personnel, date_recrutement_personnel, situation_matrimoniale_personnel,
                region_personnel, departement_personnel, date_naiss_personnel, telephone_personnel,id_type_personnel, categorie_personnel, arrondissement_personnel,nb_jours_permission,nb_jours_conges,statut_personnel,next_month_permission)
                VALUES 
                (${excelData[i].ORDRE},"${excelData[i].MATRICULE}","${excelData[i].NOM_PRENOM}",
                "${excelData[i].GRADE}","${excelData[i].POSTE}","${excelData[i].STRUCTURE}","${excelData[i].STRUCTURE_01}","${excelData[i].SEXE}",
                "${excelData[i].DATE_RECRUTEMENT}","${excelData[i].SITUATION_MATRIMONIALE}","${excelData[i].REGION}",
                "${excelData[i].DEPARTEMENT}","${excelData[i].DATE_NAISSANCE}","${excelData[i].TELEPHONE}","${type}",
                "${excelData[i].CATEGORIE}","${excelData[i].ARRONDISSEMENT}","${nb_jours_permission}","${nb_jours_conges}","${statut}",'${JSON.stringify(next_month_permission)}');`;
                window.electronAPI.addPersonnel(req);
            }
            window.electronAPI.personnelAddedSuccess(() => {
                setSuccess("Personnel ajouté avec succès");
            });
            setTimeout(() => {
                setSuccess("");
            }, 3000)
        } catch (err) {
            console.error("Erreur Trouvé : " + err.message);
        }
    }

    /** useeffect for common function and fetching */
    const fetchDatas = async () => {
        try {
            window.electronAPI.getPersonnel();
            await window.electronAPI.receivePersonnel((event, res) => {
                for (let index = 0; index < res.length; index++) {
                    res[index].next_month_permission = JSON.parse(res[index].next_month_permission)                                                
                }
                setPersonnel(res);
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

    /** for the pagination */
    const pageCount = Math.ceil(personnel.length/perPage);
    const offset = pageNumber * perPage;
    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    }

    const handlePagePrev = () => {
        setPageNumber(pageCount <= 1 || pageNumber === 0? pageNumber : pageNumber - 1);
    }
    const handlePageNext = () => {
        setPageNumber(pageCount <= 1 || pageCount === pageNumber + 1 ? pageNumber : pageNumber + 1);
    }

    /** for the filter and the search bar */

    const filterPersonnel = filter !== "" || search !== "" || status !== ""
        ? personnel.filter(personnel => personnel.categorie_personnel.includes(filter) && (
            personnel.nom_prenom_personnel.toLowerCase().includes(search.toLowerCase()) 
            || personnel.matricule_personnel.toLowerCase().includes(search.toLowerCase())
        ) && personnel.statut_personnel.includes(status))
        : personnel

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleStatus = (e) => {
        setStatus(e.target.value);
    }

    /** for the current selected personnle page */
    const handleCongeClick = (person) => {
        navigate("/admin/conges", {state: {selectedPerson: person}});
        setSelectedPerson(person);
    }

    const handleDetailClick = (person) => {
        navigate("/admin/personnel-details", {state: {selectedPerson: person}});
        setSelectedPerson(person);
    }

    const handlePermissionClick = (person) => {
        navigate("/admin/permission", {state: {selectedPerson: person}});
        setSelectedPerson(person);
    }

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>  
            <Row>
                <Col lg="12">
                    { success && 
                        <Alert className="text-center" color="success">
                            {success}
                        </Alert>
                    }
                </Col>
            </Row>
            {/* Table */}
            <Row>
                <Col lg="12">
                    <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                        <input 
                            type="file" 
                            className="form-control" 
                            required 
                            disabled={personnel.length > 0 ? true : false}
                            onChange={handleFile}
                        />
                        <button 
                            type="submit" 
                            disabled={personnel.length > 0 ? true : false}
                            className="mt-3 btn btn-primary btn-md"
                        >
                            Importer le fichier
                        </button>
                        {typeError&&(
                            <div className="mt-3 alert alert-danger" role="alert">
                                {typeError}
                            </div>
                        )}
                    </form>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
                    {excelData || personnel.length > 0 ? (
                        <div>
                            <div className="mt-3 alert alert-success" role="alert">
                                <h3 className="mb-0 text-center text-white"> Fichier importer avec succès ! </h3>
                            </div>
                            <Card className="shadow">
                            </Card>
                        </div>
                    ) : (  
                        <div>
                            <div className="mt-3 alert alert-danger" role="alert">
                                <h3 className="mb-0 text-center text-white"> Aucun Fichier importer ! </h3>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <Input
                        type="select"
                        className="form-control"
                        onChange={handleFilterChange}
                        value={filter}
                    >
                        <option value="">Toutes les catégories</option>
                        <option value="A1">A1</option>
                        <option value="B1">B1</option>
                        <option value="A2">A2</option>
                        <option value="B2">B2</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                    </Input>
                </Col>
                <Col lg="6">
                    <Input
                        type="select"
                        className="form-control"
                        placeholder="Rechercher par nom ou matricule"
                        onChange={handleStatus}
                        value={status}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="en congé">en congé</option>
                        <option value="en poste">en poste</option>
                        <option value="en permission">en permission</option>
                    </Input>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
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
                            </Card>
                        </div>
                </div>
            </Row>
            <Row className="m-0 justify-content-center">
                <CardFooter className="py-3 d-flex" >
                    <nav className="ligna-items-center" aria-label="...">
                        <Pagination
                          className="pagination justify-content-center"
                          listClassName="justify-content-center"
                        >
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePagePrev()}
                              tabIndex="-1"
                            >
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </PaginationLink>
                          </PaginationItem>
                            {Array.from({length: pageCount}, (_, i) => (
                                <PaginationItem key={i} active={i === pageNumber}>
                                    <PaginationLink onClick={() => handlePageChange({selected: i})}>
                                        {i}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageNext()}
                            >
                              <i className="fas fa-angle-right" />
                              <span className="sr-only">Next</span>
                            </PaginationLink>
                          </PaginationItem>
                        </Pagination>
                    </nav>
                </CardFooter>
            </Row>
            <Row>
                <div className="col p-0">
                    <button type="submit" className="mt-3 btn btn-secondary btn-md">Exporter le fichier</button>
                    <button type="submit" className="mt-3 btn btn-secondary btn-md" onClick={addPersonnel}>Intégrer à la base de données</button>
                </div>
            </Row>
        </Container>
      </>
    );  
}
export default Personnel;