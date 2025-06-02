import { Container } from "reactstrap";
import Header from "components/Headers/Header.js";
import { Row,Col,Card,CardHeader,CardBody,Button,Alert,Form,Input,FormGroup,Label } from 'reactstrap';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import StatsDoc from "documents/StatsDoc";
import Select from "react-select";
import { useState, useEffect } from "react";

const FicheStatsGlobal = () => {
    const date = new Date().getDate() + '_' + parseInt(new Date().getMonth() + 1 )+ '_' + new Date().getFullYear()
    const [conges, setConges] = useState([]);
    //const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    //const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    //const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState(null); // structure filter
    const [yearFilter, setYearFilter] = useState(null);
    //const [typeFilter, setTypeFilter] = useState(null); // periodique | annuel
    const [structureNames, setStructureNames] = useState([]);
    const [years, setYears] = useState([]);

    const handleInputChange = (setStateFunction) => (e) => {
        setStateFunction(e.target.value);
    };

    /*const types = [
        { libelle_type_stat: "annuel" },
        { libelle_type_stat: "périodique" },
    ];

    const typesOptions = types.map((t, i) => ({
        value: t.libelle_type_stat,
        label: t.libelle_type_stat,
    }));*/

    const yearOptions = years.map((y, i) => ({
        value: y.annee,
        label: y.annee,
    }));

    const options = structureNames.map((t, i) => ({
        value: t.structure_personnel,
        label: t.structure_personnel,
    }));
    
    const handleFilterChange = (setState) => (selectedOption) => {
        setState(selectedOption); 
    };

    const generateStats = async () => {
        try {
            if(filter === null || yearFilter === null) {
                setError("Selectionner au moins une structure et une année pour générer les statistiques.");
                setTimeout(() => {
                    setError("");
                }, 7000);
                return ;
            }
            const structures = Object.entries(filter).map(([key, value]) => ({
                names : value.value
            }));
            const strucArray = structures.map(s => `'${s.names.replace(/'/g, "''")}'`).join(", ");;
            console.log(strucArray)
            let query = `
                SELECT * FROM conge 
                INNER JOIN personnel ON personnel.id_personnel = conge.id_personnel AND personnel.structure_personnel IN (${strucArray})
            `;
            /*const hasFilter = !!filter?.value;
            const hasYear = !!yearFilter?.value;
            const isAnnuel = "annuel";
            const isPeriodique = typeFilter === "périodique";
            let conditions = [];
            if (hasFilter) {
                conditions.push(`personnel.structure_personnel = ${JSON.stringify(filter.value)}`);
            }
            if (isAnnuel && hasYear) {
                conditions.push(`YEAR(date_fin_conge) = '${yearFilter.value}'`);
            }*/
            /*if (isPeriodique) {
                conditions.push(`(date_debut_conge BETWEEN '${startDate}' AND '${endDate}' OR date_fin_conge BETWEEN '${startDate}' AND '${endDate}')`);
                permissionConditions.push(`(date_debut_permission BETWEEN '${startDate}' AND '${endDate}' OR date_fin_permission BETWEEN '${startDate}' AND '${endDate}')`);
            }*/
            /*if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }*/
            console.log("REQUETE STATISTIQUE CONGE =>", query);
            /* fetching datas */
            window.electronAPI.getSpecificConge(query, 'conge');
            window.electronAPI.retrieveSpecificConge((event, res) => {
                console.log(res);
                setConges(res);
                setSuccess("Statistiques générées avec succès!");
                setTimeout(() => {
                    setSuccess("");
                }, 7000)
            });
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue pendant la génération des statistiques.");
            setTimeout(() => {
                setError("");
            }, 7000);
        }
    };

    const fetchDatas = async () => {
        try {
            window.electronAPI.getStructuresNames();
            await window.electronAPI.retrieveStructuresNames((event, res) => {
                setStructureNames(res);
            })
            window.electronAPI.getCongeYears();
            await window.electronAPI.retrieveCongesYears((event, res) => {
                setYears(res);
            })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }
    // useEffect for getting structure names
    useEffect(() => {
        fetchDatas();
    }, []);

    const computeStatistics = (conges) => {
        //const today = new Date();
        //let totalConges = conges.length;
        const stats = {};

        // Congés jusqu'à aujourd'hui
        //const congesJusquaAuj = conges.filter(d => new Date(d.date_debut_conge) <= today).length;

        // Congés par division
        const congesParDivision = {};
        conges.forEach(c => {
            const division = c.structure_personnel || "Non défini";
            congesParDivision[division] = (congesParDivision[division] || 0) + 1;
        });
        /* Personnes actuellement en congé
        const enCongesActuellement = conges.filter(c => {
            const start = new Date(c.date_debut_conge);
            const end = new Date(c.date_fin_conge);
            return today >= start && today <= end;
        }).length;*/

        return {
            stats,
        };
    };
    
    const stats = computeStatistics(conges);

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row className="mt-5">
          <Col className="order-xl-1" md="12" lg="12">
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">Définir les paramètres des statistiques</h3>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <div className="pl-lg-4">
                            <Row>
                                {/*<Col md="6">
                                    <FormGroup>  
                                        <Label for="type-conge">
                                            Type de statistiques
                                        </Label>              
                                        <Select
                                            //value={typeFilter}
                                            //onChange={handleFilterChange(setTypeFilter)}
                                            options={typesOptions}
                                            value={typesOptions.find((opt) => opt.value === typeFilter)}
                                            onChange={(e) => setTypeFilter(e?.value || null)}
                                            isSearchable={true}
                                            placeholder="Choisir le type de statistiques"
                                        />
                                    </FormGroup>
                                </Col>*/}
                                <Col md="6">
                                    <FormGroup>  
                                        <Label for="type-conge">
                                            Année 
                                        </Label>              
                                        <Select
                                            value={yearFilter}
                                            onChange={handleFilterChange(setYearFilter)}
                                            options={yearOptions}
                                            isSearchable={true}
                                            placeholder="Selectionnez une année"
                                            //isDisabled = {typeFilter === "périodique" ? true : false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <Label for="type-conge">
                                        Structure
                                    </Label> 
                                    <Select
                                        value={filter}
                                        onChange={handleFilterChange(setFilter)}
                                        options={options}
                                        isSearchable={true}
                                        isMulti={true}
                                        placeholder="Selectionnez une ou plusieurs structures"
                                    />
                                </Col>
                            </Row>
                            {/*<Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="date-depart">
                                            Date de debut
                                        </Label>
                                        <Input
                                            id="date-depart"
                                            name="date"
                                            onChange={handleInputChange(setStartDate)}
                                            value={startDate}
                                            placeholder="date"
                                            type="date"
                                            disabled={typeFilter === "annuel" ? true : false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="date-fin">
                                            Date de fin
                                        </Label>
                                        <Input
                                            id="date-fin"
                                            name="date"
                                            value={endDate}
                                            onChange={handleInputChange(setEndDate)}
                                            placeholder="date"
                                            type="date"
                                            disabled={typeFilter === "annuel" ? true : false}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>*/}
                            <Row>
                                <Col md="12">
                                    { error && 
                                        <Alert color="danger">
                                            {error}
                                        </Alert>
                                    }
                                    { success && 
                                        <Alert color="success">
                                            {success}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md="6">
                                    <Button
                                        color="primary"
                                        onClick={generateStats}
                                    >
                                        Générer la fiche statistiques
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Col>
        </Row>
            <Row className="mt-5">
                <Col className="order-xl-1" md="12" lg="12">
                    <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                                <Col xs="8">
                                    <h3 className="mb-0">Télécharger la fiche statistiques des congés et permissions</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <PDFViewer showToolbar={0} className="w-100"  height={800}>
                                    <StatsDoc
                                        stats={stats}
                                        structureName={filter}
                                        //typeStat={typeFilter}
                                        //dateDebut={startDate}
                                        //dateFin={endDate}
                                        filter={filter}
                                        anneeStat={yearFilter}
                                    />
                                </PDFViewer>
                            </Row>
                            <Row>
                                <Col className="order-xl-1 mt-2" xl="8">
                                    <PDFDownloadLink document={<StatsDoc
                                            stats={stats}
                                            structureName={filter}
                                            //typeStat={typeFilter}
                                            //dateDebut={startDate}
                                            //dateFin={endDate}
                                            filter={filter}
                                            anneeStat={yearFilter}
                                        />} fileName={`fiche_statistique_${date}.pdf`}>
                                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                                        <Button
                                            color="success"
                                        >
                                            Télécharger
                                        </Button>)}
                                    </PDFDownloadLink>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                </Row>
            </Container>
        </>
    );
}

export default FicheStatsGlobal;