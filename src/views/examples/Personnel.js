/* eslint-disable no-unused-vars */
import {
    Card,
    Input,
    Container,
    Row,
    Col,
    Alert,
  } from "reactstrap";
import Header from "components/Headers/Header.js";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import PersonnelDetails from "./PersonnelDetails";
import PersonnelsTable from "views/customs-components/PersonnelsTable";
import MyPagination from "views/customs-components/MyPagination";

const Personnel = () => {

    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [dette, setDette] = useState('');
    const [personnel, setPersonnel] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [perPage] = useState(100);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [modalData, setModalData] = useState(null); 
    const [modal, setModal] = useState(false);
    const [errorDette, setErrorDette] = useState("");
    const [successDette, setSuccessDette] = useState("");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loadingSpinner, setLoadingSpinner] = useState(true);
    const loadingText = "Aucune donnée dans la base de données";
    const navigate = useNavigate();
    const currDate = new Date();

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

    // Conge dette definition 
    const toggleModal = () => {
        setModal(!modal)
    }

    const handleRowClick = useCallback((person) => {
        setSelectedPerson(person);
        if(person.id_type_personnel === 1) {
            setError("Impossible de définir une dette de congé pour un personnel administratif");
            setTimeout(() => {
              setError("");
            }, 7000)
            return;
        } else {
            setModalData(person);
            toggleModal();
        }
    }, []);


    const handleDetteChange = (e) => {
        setDette(e.target.value);
    };

    const saveDettPersonnel = useCallback(async (person) => {
        if (dette === "") {
            setErrorDette("Veuillez Entrez une valeur valide");
            setTimeout(() => {
              setErrorDette("");
            }, 7000)
            return;
        }
        if (dette > 36) {
            setErrorDette("La dette de congé ne peux pas dépasser 36jours");
            setTimeout(() => {
              setErrorDette("");
            }, 7000)
            return;
        }
        const req = `UPDATE personnel SET dette_conge = ${parseInt(dette)} WHERE personnel.id_personnel = ${person.id_personnel}`;
        console.log(`${req}`);
        window.electronAPI.addPersonnelDette(req);
        window.electronAPI.addPersonnelDetteSuccess((event, res) => {
            setSuccessDette("Dette définie avec succès");
            setTimeout(() => {
                setSuccessDette("");
            }, 7000)
        })
    }, [dette]);

    /** add personnel to the db */
    const addPersonnel = async () => {
        try {
            for (let i = 0; i < excelData.length; i++) {
                const type = ['A2','A1','B1','B2','C','D'].includes(excelData[i].CATEGORIE) ? 1 : 2;
                const statut = "en poste";
                const nb_jours_conges = ['A2','A1','B1','B2','C','D'].includes(excelData[i].CATEGORIE) ? 30 : 18;
                //const nb_jours_conges = 0;
                const dette_conge = 0;
                const nb_jours_permission = 10;
                const nb_jours_conges_maternite = 0;
                const nb_jours_conges_mariage = 0;
                const nb_jours_conges_maladie = 0;
                const nb_jours_conges_deces = 6;
                const next_month_permission = {
                    month: 0,
                    amount: 0,
                }
                const req = `
                    INSERT INTO personnel 
                    (ordre_personnel, matricule_personnel, nom_prenom_personnel, grade_personnel, poste_personnel, structure_personnel, cellule_personnel, sexe_personnel, date_recrutement_personnel, situation_matrimoniale_personnel,
                    region_personnel, departement_personnel, date_naiss_personnel, telephone_personnel,id_type_personnel, categorie_personnel, arrondissement_personnel,nb_jours_permission,nb_jours_conges,nb_jours_conges_maladie,nb_jours_conges_maternite,nb_jours_conges_deces,nb_jours_conges_mariage,statut_personnel,next_month_permission,preposition_personnel,dette_conge)
                    VALUES 
                    (${excelData[i].ORDRE},"${excelData[i].MATRICULE}","${excelData[i].NOM_PRENOM}",
                    "${excelData[i].GRADE}","${excelData[i].POSTE}","${excelData[i].STRUCTURE}","${excelData[i].STRUCTURE_01}","${excelData[i].SEXE}",
                    "${excelData[i].DATE_RECRUTEMENT}","${excelData[i].SITUATION_MATRIMONIALE}","${excelData[i].REGION}",
                    "${excelData[i].DEPARTEMENT}","${excelData[i].DATE_NAISSANCE}","${excelData[i].TELEPHONE}","${type}",
                    "${excelData[i].CATEGORIE}","${excelData[i].ARRONDISSEMENT}","${nb_jours_permission}","${nb_jours_conges}","${nb_jours_conges_maladie}","${nb_jours_conges_maternite}","${nb_jours_conges_deces}","${nb_jours_conges_mariage}","${statut}",'${JSON.stringify(next_month_permission)}',"${excelData[i].PREPOSITION}"
                    ,"${dette_conge}")
                ;`;
                /*console.log(req);
                WHERE NOT EXISTS (
                    SELECT * FROM personnel
                    WHERE matricule_personnel = "${excelData[i].MATRICULE}"
                )*/
                window.electronAPI.addPersonnel(req);
            }
            window.electronAPI.personnelAddedSuccess(() => {
                setSuccess("Personnel ajouté avec succès");
                setTimeout(() => {
                    setSuccess("");
                }, 3000)
            });
        } catch (err) {
            setError("Aucun fichier trouvé !");
            setTimeout(() => {
                setError("");
            }, 3000)
        }
    }
    // useEffect() update for the new year 
    /*const updateYear = async () => {
        try {
            for (let x = 0; x < personnel.length; x++) {
                // --- ---- ---- 
                if (personnel[x].nb_jours_conges < 18 && personnel[x].id_type_personnel === 2) {
                    const req_personnel = `UPDATE personnel SET nb_jours_conges = (nb_jours_conges) WHERE id_personnel = ${personnel[x].id_personnel};`;
                    window.electronAPI.updatePersonnel(req_personnel);
                    window.electronAPI.congeAddedSuccess(() => {
                        console.log(`personnel mis à jour pour la nouvelle année`);
                    });
                }
                // remise à 0 pour ceux qui ont pris tout leur congé l'année précédente
                if ((personnel[x].nb_jours_conges === 18 && personnel[x].id_type_personnel === 2) || (personnel[x].nb_jours_conges === 30 && personnel[x].id_type_personnel === 1)) {
                    const req_personnel = `UPDATE personnel SET nb_jours_conges = 0 WHERE id_personnel = ${personnel[x].id_personnel};`;
                    window.electronAPI.updatePersonnel(req_personnel);
                    window.electronAPI.congeAddedSuccess(() => {
                        console.log(`personnel mis à jour pour la nouvelle année`);
                    });
                }
                // update conge maladie 
                // update conge maternite
            }
        } catch (error) {
            console.log(`Erreur lors de la mise à jour annuelle ${error.message}`);
        }
    }

    useEffect(() => {
        if (currDate.getFullYear()) {
            updateYear();
        }
    }, []);*/

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

    // format name : 
    function formatPersonnelName(person) {
        if (person.sexe_personnel === 'M')
          return 'M. ' + person.nom_prenom_personnel;
        else
          return 'Mme ' + person.nom_prenom_personnel;
      }

    return (
        <>
        <Header />
        <Container className="mt--7" fluid> 
            {/** alert for messages */} 
            <Row>
                <Col lg="12">
                    { success && 
                        <Alert className="text-center" color="success">
                            {success}
                        </Alert>
                    }
                    {
                        error && 
                        <Alert className="text-center" color="danger">
                            {error}
                        </Alert>
                    }
                </Col>
            </Row>
            {/** button and defaults options */}
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
            {/** categories filters */}
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
            {/** search bar */}
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
            {/** personnels table */}
            <PersonnelsTable 
                loadingSpinner={loadingSpinner}
                filterPersonnel={filterPersonnel}
                loadingText={loadingText}
                modal={modal}
                toggleModal={toggleModal}
                selectedPerson={selectedPerson}
                formatPersonnelName={formatPersonnelName}
                dette={dette}
                handleDetteChange={handleDetteChange}
                errorDette={errorDette}
                successDette={successDette}
                handleRefresh={ handleRefresh}
                handleCongeClick={handleCongeClick}
                handlePermissionClick={handlePermissionClick}
                handleRowClick={handleRowClick}
                handleDetailClick={handleDetailClick}
                saveDettPersonnel={saveDettPersonnel}
                perPage={perPage}
                offset={offset}
                modalData={modalData}
            />
            {/** paginations */}
            <MyPagination
                pageCount={pageCount}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
                handlePagePrev={handlePagePrev}
                handlePageNext={handlePageNext}
            />
            <Row>
                <div className="col p-0">
                    <button type="submit" disabled className="mt-3 btn btn-secondary btn-md">Exporter le fichier</button>
                    <button type="submit" className="mt-3 btn btn-secondary btn-md" onClick={addPersonnel}>Intégrer à la base de données</button>
                </div>
            </Row>
        </Container>
      </>
    );  
}
export default Personnel;