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
    Nav,
    UncontrolledTooltip,
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
    const [selectedPerson, setSelectedPerson] = useState(null);
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
                const req = `
                INSERT INTO personnel 
                (ordre, matricule, nom_prenom, grade, poste, structure, sexe, date_recrutement, situation_matrimoniale,
                region, departement, date_naiss, telephone,type, categorie, arrondissement)
                VALUES 
                (${excelData[i].ORDRE},"${excelData[i].MATRICULE}","${excelData[i].NOM_PRENOM}",
                "${excelData[i].GRADE}","${excelData[i].POSTE}","${excelData[i].STRUCTURE}","${excelData[i].SEXE}",
                "${excelData[i].DATE_RECRUTEMENT}","${excelData[i].SITUATION_MATRIMONIALE}","${excelData[i].REGION}",
                "${excelData[i].DEPARTEMENT}","${excelData[i].DATE_NAISSANCE}","${excelData[i].TELEPHONE}","${type}",
                "${excelData[i].CATEGORIE}","${excelData[i].ARRONDISSEMENT}");`;
                window.electronAPI.addPersonnel(req);
            }
            //ARRONDISSEMENT,CATEGORIE,DATE_NAISSANCE,DATE_RECRUTEMENT,DEPARTEMENT,GRADE,MATRICULE,NOM_PRENOM,
            //ORDRE,POSTE,REGION,SEXE,SITUATION_MATRIMONIALE,STRUCTURE,TELEPHONE
        } catch (err) {
            console.error("Erreur Trouvé : " + err.message);
        }
    }

    /** useeffect for common function and fetching */
    useEffect(() => {
        const func = async () => {
            try {
                await window.electronAPI.personnelAddedSuccess((event, res) => {
                    console.log("resultat requete : " + JSON.stringify(res));
                    alert("resultat requete : " + res)
                });
                window.electronAPI.getPersonnel();
                await window.electronAPI.receivePersonnel((event, res) => {
                    //console.log("pers event : " + JSON.stringify(event));
                    //console.log("pers res : " + JSON.stringify(res));
                    setPersonnel(res);
                })
            } catch (error) {
                console.error("Erreur : " + error.message);
            }
        }
        func();
    }, []);

    /** for the pagination */
    const pageCount = Math.ceil(personnel.length/perPage);
    const offset = pageNumber * perPage;
    const handlePageChange = ({selected}) => {
        setPageNumber(selected);
    }

    /** for the filter and the search bar */

    const filterPersonnel = filter !== "" || search !== ""
        ? personnel.filter(personnel => personnel.categorie.includes(filter) && (
            personnel.nom_prenom.toLowerCase().includes(search.toLowerCase()) || personnel.matricule.toLowerCase().includes(search.toLowerCase())
        ))
        : personnel

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    /** for the current selected personnle page */
    const handleDetailsClick = (person) => {
        console.log("person selected", person);
        navigate("/admin/conges", {state: {selectedPerson: person}});
        setSelectedPerson(person);
    }

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col p-0">
                    <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                        <input type="file" className="form-control" required onChange={handleFile}/>
                        <button type="submit" className="mt-3 btn btn-primary btn-md">Importer le fichier</button>
                        {typeError&&(
                            <div className="mt-3 alert alert-danger" role="alert">
                                {typeError}
                            </div>
                        )}
                    </form>
                </div>
            </Row>
            <Row>
                <div className="col p-0">
                    {excelData ? (
                        <div className="col p-0">
                            <div className="mt-3 alert alert-success" role="alert">
                                <h3 className="mb-0 text-center text-white"> Fichier importer avec succès ! </h3>
                            </div>
                            <Card className="shadow">
                                {/*<Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            {Object.keys(excelData[0]).map((key) => (
                                                <th key={key}>
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {excelData.map((row, index) => (
                                            <tr key={index}>
                                                {Object.keys(row).map((key) => (
                                                    <td key={key}>
                                                        {row[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                                </Table>*/}
                            </Card>
                        </div>
                    ) : (  
                        <div className="col p-0">
                            <div className="mt-3 alert alert-danger" role="alert">
                                <h3 className="mb-0 text-center text-white"> Aucun Fichier importer ! </h3>
                            </div>
                        </div>
                    )}
                </div>
            </Row>
            <Row>
                <div className="col">
                    <div className="form-group custom-form">
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
                        </Input>
                        <Input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Rechercher par nom ou matricule"
                            onChange={handleSearch}
                            value={search}
                        />
                    </div>
                </div>
            </Row>
            <Row>
                <div className="col p-0">
                    {personnel && personnel.length > 0 ? (
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0 text-center">Listes du personnel </h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Matricule</th>
                                            <th>Nom & Prenom</th>
                                            <th>Grade</th>
                                            <th>Poste</th>
                                            <th>Structure</th>
                                            <th>Sexe</th>
                                            <th>Date recrutement</th>
                                            <th>Situation Matrimoniale</th>
                                            <th>Region</th>
                                            <th>Departement</th>
                                            <th>Date de naissance</th>
                                            <th>Telephone</th>
                                            <th>Categorie</th>
                                            <th>Arrondissement</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterPersonnel.slice(offset, offset + perPage).map((person, index) => (
                                            <tr key={index}>
                                                <td>{person.matricule}</td>    
                                                <td>{person.nom_prenom}</td>    
                                                <td>{person.grade}</td>    
                                                <td>{person.poste}</td>    
                                                <td>{person.structure}</td>    
                                                <td>{person.sexe}</td>    
                                                <td>{person.date_recrutement}</td>    
                                                <td>{person.situration_matrimoniale}</td>    
                                                <td>{person.region}</td>    
                                                <td>{person.departement}</td>    
                                                <td>{person.date_naiss}</td>    
                                                <td>{person.telephone}</td>    
                                                <td>{person.categorie}</td>    
                                                <td>{person.arrondissement}</td>  
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
                                                                onClick={() => handleDetailsClick(person)}
                                                            >
                                                                Nouveau Congé
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                Détails
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
                                    <h3 className="mb-0 text-center"> Aucun personnel dans la base de données </h3>
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