/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Input } from "reactstrap";
import Header from "components/Headers/Header.js";
import { Row,Col,Card,CardHeader,CardBody,Button,Alert,Form,FormGroup,Label } from 'reactstrap';
import { PDFDownloadLink } from "@react-pdf/renderer";
import GlobalStatsDoc from "documents/GlobalStatsDoc";
import Select from "react-select";
import { useState, useEffect } from "react";
import StructStatsDoc from "documents/StrucStatsDoc";
import PersonStatsDoc from "documents/PersonStatsDoc";
import { generateStatsFileName } from "utils/utils";

const FicheStatsGlobal = () => {
    const [conges, setConges] = useState([]);
    const [infoMsg, setInfoMsg] = useState({});
    const [structureNames, setStructureNames] = useState([]);
    const [personnelNames, setPersonnelNames] = useState([]);
    const [years, setYears] = useState([]);
    const [showPdf, setShowPdf] = useState(false);
    const [statType, setStatType] = useState(null);
    const [filter, setFilter] = useState([]);
    const [name, setName] = useState([]);
    const [yearFilter, setYearFilter] = useState(null);
    const [stats, setStats] = useState(null);
    const [structStats, setStructStats] = useState(null);
    const [personnelStats, setPersonnelStats] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [title, setTitle] = useState("");
    const [sort, setSort] = useState(null);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const typeOptions = [
        { value: "globales", label: "Globales" },
        { value: "structure", label: "Par Structure" },
        { value: "personnel", label: "Par Personne" },
    ];

    const sortOptions = [
        { value: "ASC", label: "Ascendant (ordre alphabetique de noms)" },
        { value: "DESC", label: "Descendant (ordre alphabetique de noms)" },
        { value: "default", label: "Par Défaut (ordre de selection)" },
    ]

    const yearOptions = years.map((y, i) => ({
        value: y.annee,
        label: y.annee,
    }));

    const options = structureNames.map((t, i) => ({
        value: t.structure_personnel,
        label: t.structure_personnel,
    }));

    const personnelOptions = personnelNames.map((t, i) => ({
        value: t.id_personnel,
        label: t.nom_prenom_personnel,
    }));

    
    const handleFilterChange = (setState) => (selectedOption) => {
        setState(selectedOption);
    };

    // a function help to set state from input change
    const handleStateChange = (setState) => (e) => {
        setState(e.target.value);
    }

    const errorShow = (obj) => {
        if (!obj || !obj.msg || !obj.type) {
            setInfoMsg(null);
            return;
        }
        setInfoMsg({ msg: obj.msg, type: obj.type });
        setTimeout(() => setInfoMsg(null), 3000);
    };

    useEffect(() => {
        setShowPdf(false);
        setPdfDoc(null);
    }, [statType, yearFilter, filter, name, sort]);

    useEffect(() => {
        setFilter([]);
    }, [statType]);

    const generateStats = async (currentSort) => {
        try {
            // building query
            let query = '';
            if(yearFilter === null) {
                errorShow({msg: "Selectionner une année pour générer les statistiques.", type: "error"});
                return ;
            }
            if(!currentSort?.value) {
                errorShow({msg: "Selectionner un ordre de tri pour générer les statistiques.", type: "error"});
                return ;
            }
            if(!statType.value) {
                errorShow({msg: "Selectionner au moins un type de statistiques pour générer les statistiques.", type: "error"});
                return ;
            }
            if (statType.value === "structure" && filter.length <= 0) {
                errorShow({msg: "Selectionner au moins une structure pour générer ses statistiques.", type: "error"});
                return ;
            }
            if (statType.value === "personnel" && name.length <= 0) {
                errorShow({msg: "Selectionner au moins une personne pour générer ses statistiques.", type: "error"});
                return ;
            }
            if (statType.value === "personnel" && yearFilter.value !== "" && name.length > 0 && currentSort.value !== null) {
                const names = Object.entries(name).map(([key, value]) => ({
                    names : value
                }));
                const nameArray = names.map(s => `${s.names.value}`).join(", ");
                query = `
                    SELECT *
                    FROM personnel
                    LEFT JOIN conge
                        ON personnel.id_personnel = conge.id_personnel
                        AND YEAR(conge.date_debut_conge) = ${yearFilter.value}
                    WHERE personnel.id_personnel IN (${nameArray})
                    ${currentSort.value !== "default" ? "ORDER BY personnel.nom_prenom_personnel " + currentSort.value + ";" : "ORDER BY FIELD(personnel.id_personnel, " + nameArray + ");"}
                `;
                console.log(currentSort)
                console.log(query)
            }
            if(statType.value === "globales" && filter.length > 0 && yearFilter.value !== "" && currentSort.value !== null) {
                const structures = Object.entries(filter).map(([key, value]) => ({
                    names : value
                }));
                const strucArray = structures.map(s => `'${s.names.value.replace(/'/g, "''")}'`).join(", ");
                query = `
                    SELECT * FROM conge
                    INNER JOIN personnel
                    ON personnel.id_personnel = conge.id_personnel WHERE personnel.structure_personnel
                    IN (${strucArray}) && YEAR(conge.date_debut_conge) = ${yearFilter.value}
                    ${currentSort.value !== "default" ? "ORDER BY personnel.nom_prenom_personnel " + currentSort.value + ", conge.date_debut_conge " + currentSort.value + ";"
                    : "ORDER BY FIELD(personnel.structure_personnel, " + strucArray + ");"}`;
            }
            if (statType.value === "globales" && filter.length === 0 && yearFilter.value !== "" && currentSort.value !== null) {
                query = `
                    SELECT * FROM conge
                    INNER JOIN personnel
                        ON personnel.id_personnel = conge.id_personnel
                        WHERE YEAR(conge.date_debut_conge) = ${yearFilter.value}
                    ${currentSort.value !== "default" ? "ORDER BY personnel.nom_prenom_personnel " + currentSort.value + ", conge.date_debut_conge " + currentSort.value + ";"
                    : "ORDER BY personnel.structure_personnel, conge.date_debut_conge"};`;
            }
            if (statType.value === "structure" && filter.value !== "" && yearFilter.value !== "" && currentSort.value !== null) {
                const structures = Object.entries(filter).map(([key, value]) => ({
                    names : value
                }));
                const strucArray = structures.map(s => `'${s.names.value.replace(/'/g, "''")}'`).join(", ");
                query = `
                    SELECT *
                    FROM personnel
                    LEFT JOIN conge
                        ON personnel.id_personnel = conge.id_personnel
                        AND YEAR(conge.date_debut_conge) = ${yearFilter.value}
                    WHERE personnel.structure_personnel IN (${strucArray})
                    ${sort.value !== "default" ? "ORDER BY personnel.nom_prenom_personnel " + currentSort.value + ", conge.date_debut_conge " + currentSort.value + ";"
                    : "ORDER BY personnel.structure_personnel, conge.date_debut_conge"};`;
            }
            // fetching datas
            const res = await window.electronAPI.getStatsConge(query);
            setConges(res);
            setStats(computeStatistics(res, filter, structureNames));
            setStructStats(computeStructStats(res));
            setPersonnelStats(computePersonStats(res));
            errorShow({msg: "Statistiques générées avec succès!", type: "success"});
            setShowPdf(true);
        } catch (err) {
            console.error(`error message : ${err.message}}`);
            errorShow({msg: "Une erreur est survenue pendant la génération des statistiques.", type: "error"});
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
            window.electronAPI.getPersonnel();
            await window.electronAPI.receivePersonnel((event, res) => {
                setPersonnelNames(res);
            })
        } catch (error) {
            console.error("Erreur : " + error.message);
        }
    }

    useEffect(() => {
        fetchDatas();
    }, []);

    const computeStatistics = (conges, filter, structureNames) => {
        try {
            const stats = {};
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
                const type = c.id_type_personnel === 1 ? "fonctionnaire" : "contractuel";
                const endDate = new Date(c.date_debut_conge);
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
        } catch (error) {
            console.error(`error message : ${error.message}}`);
            return {};
        }
    };

    const computePersonStats = (conges) => {
        try {
            const stats = {};
            const personnelList = conges.filter(
                (c) => c.nom_prenom_personnel
            );

            if (personnelList.length === 0)
                return { stats: {}, isGlobal: false };
            // ✅ Initialize per-person stats
            personnelList.forEach((p) => {
                const personnelKey =
                    `${p.nom_prenom_personnel || ""}`.trim() || "Non défini";
                stats[personnelKey] = {
                    id_type_personnel: p.id_type_personnel,
                    conges: [],
                    months: {},
                    total: 0
                };
                monthNames.forEach((month) => {
                    stats[personnelKey].months[month] = null;
                });
            });

            conges.forEach((c) => {
                if (!c.date_debut_conge || !c.date_fin_conge) return;
                const personnelKey = `${c.nom_prenom_personnel || ""}`.trim();
                const startDate = new Date(c.date_debut_conge);
                const endDate = new Date(c.date_debut_conge);
                const duration = c.duree_conge || 0;
                const monthName = monthNames[endDate.getMonth()];
                if (!stats[personnelKey]) {
                    stats[personnelKey] = {
                        id_type_personnel: c.id_type_personnel,
                        conges: [],
                        months: {},
                        total: 0
                    };
                    monthNames.forEach((month) => {
                        stats[personnelKey].months[month] = null;
                    });
                }
                stats[personnelKey].months[monthName] = `(${duration} jrs)`;
                stats[personnelKey].total++;
                stats[personnelKey].conges.push({
                    monthName,
                    startDate,
                    endDate,
                    duration
                });
            });
            const globalMonthTotals = {};
            let totalGlobal = 0;
            monthNames.forEach((month) => {
                globalMonthTotals[month] = 0;
            });
            Object.values(stats).forEach((p) => {
                monthNames.forEach((month) => {
                    if (p.months[month]) {
                        globalMonthTotals[month]++;
                        totalGlobal++
                    }
                });
            });
            return {
                stats,
                globalMonthTotals,
                totalGlobal,
                isGlobal: false
            };
        } catch (error) {
            console.error(`computePersonnelStats error: ${error.message}`);
            return {};
        }
    }

    const computeStructStats = (conges) => {
        try {
            const stats = {};
            const personnelList = conges.filter(
                (c) => c.structure_personnel
            );

            if (personnelList.length === 0)
                return { stats: {}, isGlobal: false };
            // ✅ Initialize per-person stats
            personnelList.forEach((p) => {
                const personnelKey =
                    `${p.nom_prenom_personnel || ""}`.trim() || "Non défini";
                stats[personnelKey] = {
                    id_type_personnel: p.id_type_personnel,
                    fonctionnaire: p.id_type_personnel === 1,
                    contractuel: p.id_type_personnel !== 1,
                    conges: [],
                    months: {},
                    total: 0
                };
                monthNames.forEach((month) => {
                    stats[personnelKey].months[month] = null;
                });
            });

            conges.forEach((c) => {
                if (!c.date_debut_conge || !c.date_fin_conge) return;

                const personnelKey = `${c.nom_prenom_personnel || ""}`.trim();
                const startDate = new Date(c.date_debut_conge);
                const endDate = new Date(c.date_debut_conge);
                const duration = c.duree_conge || 0;
                const monthName = monthNames[endDate.getMonth()];
                if (!stats[personnelKey]) {
                    stats[personnelKey] = {
                        id_type_personnel: c.id_type_personnel,
                        fonctionnaire: c.id_type_personnel === 1,
                        contractuel: c.id_type_personnel !== 1,
                        conges: [],
                        months: {},
                        total: 0
                    };
                    monthNames.forEach((month) => {
                        stats[personnelKey].months[month] = null;
                    });
                }
                stats[personnelKey].months[monthName] = `(${duration} jrs)`;
                stats[personnelKey].total++;
                stats[personnelKey].conges.push({
                    monthName,
                    startDate,
                    endDate,
                    duration
                });
            });
            const globalMonthTotals = {};
            let totalFonctionnaire = 0;
            let totalContractuel = 0;
            monthNames.forEach((month) => {
                globalMonthTotals[month] = { fonctionnaire: 0, contractuel: 0 };
            });
            Object.values(stats).forEach((p) => {
                monthNames.forEach((month) => {
                    if (p.months[month]) {
                        if (p.fonctionnaire) {
                            globalMonthTotals[month].fonctionnaire++;
                            totalFonctionnaire++;
                        } else {
                            globalMonthTotals[month].contractuel++;
                            totalContractuel++;
                        }
                    }
                });
            });
            return {
                stats,
                globalMonthTotals,
                totalFonctionnaire,
                totalContractuel,
                isGlobal: false
            };
        } catch (error) {
            console.error(`computeStructStats error: ${error.message}`);
            return {};
        }
    };

    useEffect(() => {
        if (!statType || !yearFilter || !sort || !stats || !structStats || !personnelStats) {
            setPdfDoc(null);
            return;
        }

        if (statType.value === "globales") {
            setPdfDoc(<GlobalStatsDoc stats={stats} year={yearFilter} title={title}/>);
        }
        if (statType.value === "structure") {
            setPdfDoc(<StructStatsDoc stats={structStats} year={yearFilter} structure={filter} title={title}/>);
        }
        if (statType.value === "personnel") {
            setPdfDoc(<PersonStatsDoc stats={personnelStats} year={yearFilter} structure={name} title={title}/>);
        }
    }, [statType, yearFilter, showPdf]);


    // file name according to your requested format
    const date = new Date().getDate() + '_' + parseInt(new Date().getMonth() + 1 )+ '_' + new Date().getFullYear()
    const safeDate = yearFilter?.value || (new Date().getFullYear());
    const fileName = generateStatsFileName(statType, filter, safeDate, date);

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
                                            <Col md="12">
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
                                                <FormGroup>
                                                    <Label for="type-conge">
                                                        Type de statitistiques
                                                    </Label>
                                                    <Select
                                                        value={statType}
                                                        onChange={handleFilterChange(setStatType)}
                                                        options={typeOptions}
                                                        isSearchable
                                                        placeholder="Selectionnez un type de statistiques"
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
                                                    isSearchable
                                                    isDisabled={statType?.value === "personnel"}
                                                    isMulti={statType?.value !== "structure" || statType?.value !== "personnel"}
                                                    placeholder="Selectionnez une structure"
                                                />
                                            </Col>
                                            <Col md="12">
                                                <Label for="sort-order">
                                                    Ordre de classement
                                                </Label>
                                                <Select
                                                    value={sort}
                                                    onChange={handleFilterChange(setSort)}
                                                    options={sortOptions}
                                                    isSearchable
                                                    placeholder="Selectionnez un ordre de classement"
                                                />
                                            </Col>
                                            <Col md="12" className="mt-4">
                                                <Label for="personnel">
                                                    Personnel
                                                </Label>
                                                <Select
                                                    value={name}
                                                    onChange={handleFilterChange(setName)}
                                                    options={personnelOptions}
                                                    isSearchable
                                                    isDisabled={statType?.value !== "personnel"}
                                                    isMulti={statType?.value !== "globales" || statType?.value !== "structure"}
                                                    placeholder="Selectionnez une personne"
                                                />
                                            </Col>
                                            <Col md="12" className="mt-4">
                                                <Label for="title">
                                                    Titre (optionnel)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="title"
                                                    placeholder="Titre à afficher dans la fiche statistiques"
                                                    onChange={handleStateChange(setTitle)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                { infoMsg !== null && infoMsg.type && infoMsg.msg &&
                                                    <Alert color={infoMsg.type === "error" ? "danger" : "success"} className="mt-3">
                                                        {infoMsg.msg}
                                                    </Alert>
                                                }
                                            </Col>
                                        </Row>
                                        <Row className="mt-4">
                                            <Col md="6">
                                                <Button
                                                    color="primary"
                                                    onClick={() => generateStats(sort)}
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
                                        <h3 className="mb-0">Télécharger la fiche statistiques des congés</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            {pdfDoc && (
                                <CardBody>
                                    <Row>
                                        <Col className="order-xl-1 mt-2" xl="8" style={{ textAlign: "center" }}>
                                            <PDFDownloadLink
                                                document={pdfDoc}
                                                fileName={fileName}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                            {({ loading }) =>
                                                loading
                                                ? "Génération du fichier PDF en cours, veuillez patienter..."
                                                : <Button color="success">Télécharger</Button>
                                            }
                                            </PDFDownloadLink>
                                        </Col>
                                    </Row>
                                </CardBody>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FicheStatsGlobal;