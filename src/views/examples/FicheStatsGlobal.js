import { Container } from "reactstrap";
import Header from "components/Headers/Header.js";
import { Row,Col,Card,CardHeader,CardBody,Button,Alert,Form,Input,FormGroup,Label } from 'reactstrap';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
//import StatsDoc from "documents/StatsDoc";
import NewStatsDoc from "documents/NewStatsDoc";
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
    const [filter, setFilter] = useState([]); // structure filter
    const [yearFilter, setYearFilter] = useState(null); // year filter
    //const [typeFilter, setTypeFilter] = useState(null); // periodique | annuel
    const [structureNames, setStructureNames] = useState([]);
    const [years, setYears] = useState([]);
    const [showPDF, setShowPDF] = useState(false);

    const handleInputChange = (setStateFunction) => (e) => {
        setStateFunction(e.target.value);
    };

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
            if(yearFilter === null) {
                setError("Selectionner au moins une année pour générer les statistiques.");
                setTimeout(() => {
                    setError("");
                }, 7000);
                return ;
            }
            let query = '';
            if (filter !== null) {
                const structures = Object.entries(filter).map(([key, value]) => ({
                    names : value.value
                }));
                const strucArray = structures.map(s => `'${s.names.replace(/'/g, "''")}'`).join(", ");
                query = `
                    SELECT * FROM conge
                    INNER JOIN personnel ON personnel.id_personnel = conge.id_personnel AND personnel.structure_personnel IN (${strucArray})
                `;
            }
            query = `
                SELECT * FROM conge
                INNER JOIN personnel ON personnel.id_personnel = conge.id_personnel
                ORDER BY personnel.structure_personnel, conge.date_debut_conge;
                `;
            console.log("REQUETE STATISTIQUE CONGE =>", query);
            /* fetching datas */
            window.electronAPI.getSpecificConge(query, 'conge');
            window.electronAPI.retrieveSpecificConge((event, res) => {
                //console.log(res);
                setConges(res);
                setSuccess("Statistiques générées avec succès!");
                setShowPDF(true); // ✅ show PDF only now
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

    const computeStatistics = (conges, filter, structureNames) => {
        const stats = {};
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        //const selectedStructures = Object.entries(filter).map(([key, value]) => value.value);
        const selectedStructures =
        filter && Object.keys(filter).length > 0
            ? Object.entries(filter).map(([_, value]) => value.value)
            : structureNames.map(s => s.structure_personnel);
        selectedStructures.forEach(structureName => {
            const rawStructure = structureName || "Non défini";
            const match = rawStructure.match(/\[([^\]]+)\]/);
            const structure = match ? match[1] : structureName;
            if (!stats[structure]) {
                stats[structure] = {
                    fonctionnaire: { total: 0 },
                    contractuel: { total: 0 },
                    total: 0
                };
                monthNames.forEach(month => {
                    stats[structure].fonctionnaire[month] = 0;
                    stats[structure].contractuel[month] = 0;
                });
            }
        });
        conges.forEach(c => {
            const rawStructure = c.structure_personnel;
            if (!selectedStructures.includes(rawStructure)) return;
            const match = rawStructure.match(/\[([^\]]+)\]/);
            const structure = match ? match[1] : c.structure_personnel;
            const type = c.type_personnel === 1 ? "fonctionnaire" : "contractuel";
            const endDate = new Date(c.date_fin_conge);
            const monthName = monthNames[endDate.getMonth()];
            if (!stats[structure]) {
                stats[structure] = {
                    fonctionnaire: { total: 0 },
                    contractuel: { total: 0 },
                    total: 0
                };
                monthNames.forEach(month => {
                    stats[structure].fonctionnaire[month] = 0;
                    stats[structure].contractuel[month] = 0;
                });
            }
            stats[structure][type][monthName]++;
            stats[structure][type].total++;
            stats[structure].total++;
        });
        const globalMonthTotals = {};
        let totalFonctionnaire = 0;
        let totalContractuel = 0;

        monthNames.forEach(month => {
            globalMonthTotals[month] = { fonctionnaire: 0, contractuel: 0 };
        });

        Object.values(stats).forEach(structureData => {
            monthNames.forEach(month => {
                const fonc = structureData.fonctionnaire?.[month] || 0;
                const cont = structureData.contractuel?.[month] || 0;

                globalMonthTotals[month].fonctionnaire += fonc;
                globalMonthTotals[month].contractuel += cont;

                totalFonctionnaire += fonc;
                totalContractuel += cont;
            });
        });
        const isGlobal = filter && Object.keys(filter).length > 0 ? false : true
        return { stats, globalMonthTotals, totalFonctionnaire,  totalContractuel, isGlobal};
    };
    
    const stats = computeStatistics(conges, filter, structureNames);

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
                {showPDF && (
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
                                        <PDFViewer showToolbar={0} className="w-100" height={800}>
                                            <NewStatsDoc
                                                stats={stats}
                                                year={yearFilter}
                                            />
                                        </PDFViewer>
                                    </Row>
                                    <Row>
                                        <Col className="order-xl-1 mt-2" xl="8" style={{ textAlign: "center" }}>
                                            <PDFDownloadLink
                                                document={<NewStatsDoc stats={stats} year={yearFilter} />}
                                                fileName={`fiche_statistique_${date}.pdf`}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                {({ blob, url, loading, error }) =>
                                                loading ? (
                                                    <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        minHeight: "120px",
                                                    }}>
                                                        <div
                                                            className="spinner-border text-success"
                                                            role="status"
                                                            style={{
                                                                width: "10rem",
                                                                height: "10rem",
                                                        }}>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        <div style={{
                                                            fontSize: "14px",
                                                            color: "#198754",
                                                            fontWeight: "500",
                                                            textAlign: "center"
                                                        }}>
                                                            Génération du fichier PDF en cours, veuillez patienter...
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button color="success">
                                                        Télécharger
                                                    </Button>
                                                )
                                                }
                                            </PDFDownloadLink>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
}

export default FicheStatsGlobal;