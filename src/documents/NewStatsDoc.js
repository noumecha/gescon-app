import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import TimesNewRoman from './docs-fonts/times new roman.ttf';
import TimesNewRomanBold from './docs-fonts/times new roman bold.ttf';
import TimesNewRomanItalic from './docs-fonts/times new roman bold italic.ttf';
import { generateQRCode } from 'utils/generateQRCode';

// Font registration
Font.register({
    family: 'Times-Roman',
    fonts: [
        { src: TimesNewRoman },
        { src: TimesNewRomanItalic, fontStyle: 'italic' },
        { src: TimesNewRomanBold, fontWeight: 'bold' },
    ],
});
Font.registerHyphenationCallback(word => [word]);

const makeBreakable = (str) => {
    if (!str) return str;
    //return str.replace(/([\/\\\-_\.])/g, '$1\u200B')
    return str.replace(/\//g, '/ ');
};

const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        fontFamily: 'Times-Roman',
        paddingHorizontal: 25,
        paddingVertical: 70,
        fontSize: 10,
    },
    // header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        top: 15,
        left: 25,
        right: 25,
        textAlign: 'center',
        fontSize: 10,
        paddingBottom: 3,
    },
        topSectionOne: {
        fontSize: 9,
        flex: 1,
        textAlign: 'center',
        lineHeight: 1,
        marginLeft: -50,
    },
    topSectionTwo: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 1,
        marginRight: -60,
    },
    line: {
        textAlign: 'center',
        marginTop: -2,
        letterSpacing: 1,
    },
    h1TitleFirst: {
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h1Title: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
    },
    h1TitleBold: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
    },
    h4Title: {
        marginTop: 2,
        fontFamily: 'Times-BoldItalic',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    // footer
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 25,
        right: 25,
        borderTop: '1 solid black',
        paddingTop: 3,
        fontSize: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qrCode: {
        width: 35,
        height: 35,
    },
    title: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginVertical: 10,
        textTransform: 'uppercase',
    },
    table: {
        display: 'flex',
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    cellHeader: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cellHeaderNoBorderBottom: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        borderBottom: 'none',
    },
    cellHeaderNoBorderTop: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        borderTop: 'none',
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 1.15,
    },
});

const PageWithHeaderFooter = ({ children, headerText, qrData }) => {
    const d = new Date();
    return (
        <Page size="A4" orientation="landscape" style={styles.page}>
            {/* Global Header */}
            <View style={styles.header} fixed>
                {/* top left text */}
                <View style={styles.topSectionOne}>
                    <Text style={styles.h1TitleFirst}>
                        REPUBLIQUE DU CAMEROUN
                    </Text>
                    <Text style={styles.h4Title}>
                        PAIX - TRAVAIL - PATRIE
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        MINISTÈRE DES FINANCES
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        SECRETARIAT GÉNÉRAL
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1TitleBold}>
                        DIRECTION GÉNÉRALE DU BUDGET
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        SOUS-DIRECTION DES AFFAIRES GÉNÉRALES
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        SERVICE DU PERSONNEL
                    </Text>
                    <Text style={styles.line}>------------</Text>
                </View>
                <View style={styles.topSectionTwo}>
                    <Text style={styles.h1TitleFirst}>
                        REPUBLIC OF CAMEROON
                    </Text>
                    <Text style={styles.h4Title}>
                        PEACE - WORK - FATHERLAND
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        MINISTRY OF FINANCE
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        SECRETARIAT GENERAL
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1TitleBold}>
                        DIRECTORATE GENERAL OF BUDGET
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        SUB-DEPARTMENT FOR GENERAL AFFAIRS
                    </Text>
                    <Text style={styles.line}>------------</Text>
                    <Text style={styles.h1Title}>
                        PERSONNEL SERVICE
                    </Text>
                    <Text style={styles.line}>------------</Text>
                </View>
            </View>

            {/* Page Body */}
            <View style={{
                    marginTop: 70,
                    marginBottom: 45,
                }}>
                {children}
            </View>

            {/* Global Footer */}
            <View style={styles.footer} fixed>
                <Text>Généré le {d.toLocaleDateString()} à {d.toLocaleTimeString()}</Text>
                <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                {qrData && <Image src={qrData} style={styles.qrCode} />}
            </View>
        </Page>
    );
};

const NewStatsDoc = ({ stats, year }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);
    React.useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, []);
    
    if (!stats || !stats.stats) return null;
    const entries = Object.entries(stats.stats);
    const rowsPerPage = 14;
    const pages = chunkArray(entries, rowsPerPage);

    const months = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Jui",
        "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc", "Année",
    ];

    const fullMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    return (
        <Document>
            {pages.map((pageEntries, pageIndex) => (
                <PageWithHeaderFooter key={pageIndex} qrData={qrData}>
                    {/* Title */}
                    <Text style={styles.title}>
                    {`FICHE STATISTIQUES DES CONGÉS ${year?.value || d.getFullYear()}`}
                    </Text>

                    {/* Table */}
                    <View style={styles.table}>
                        {/* Table Header */}
                        {pageIndex === 0 && (
                            <View>
                                <View style={styles.row}>
                                    <Text style={[styles.cellHeaderNoBorderBottom, { flex: 2.05 }]}>
                                        { year && year.value }
                                    </Text>
                                    {months.map((m, i) => (
                                        <Text key={i} style={styles.cellHeader}>
                                        {m}
                                        </Text>
                                    ))}
                                </View>
                                <View style={styles.row}>
                                    <Text style={[styles.cellHeaderNoBorderTop, { flex: 5 }]}>
                                        Structure
                                    </Text>
                                    {months.map((m, i) => (
                                        <React.Fragment key={i}>
                                            <Text style={styles.cellHeader}>Fnc</Text>
                                            <Text style={styles.cellHeader}>Con</Text>
                                        </React.Fragment>
                                    ))}
                                </View>
                            </View>
                        )}
                        {/* Table Body */}
                        {pageEntries.map(([structure, data], idx) => (
                            <View key={idx} style={styles.row} wrap={false}>
                            {/* Structure Name */}
                            <Text
                                style={[
                                styles.cell,
                                {
                                    textAlign: "left",
                                    paddingLeft: 3,
                                    flex: 5,
                                    flexWrap: "wrap",
                                    wordBreak: "break-word",
                                },
                                ]}
                            >
                                {makeBreakable(structure)}
                            </Text>
                            {/* Monthly Data */}
                            {fullMonths.map((month, i) => (
                                <React.Fragment key={i}>
                                    <Text style={styles.cell}>
                                        {(data.fonctionnaire && data.fonctionnaire[month]) ?? 0}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {(data.contractuel && data.contractuel[month]) ?? 0}
                                    </Text>
                                </React.Fragment>
                            ))}
                            {/* Totals */}
                            <Text style={styles.cell}>
                                {data.fonctionnaire?.total ?? 0}
                            </Text>
                            <Text style={styles.cell}>
                                {data.contractuel?.total ?? 0}
                            </Text>
                            </View>
                        ))}
                        {/* Table Footer (only on last page) */}
                        {pageIndex === pages.length - 1 && (
                            <View style={styles.row}>
                                <Text style={[styles.cellHeader, { flex: 5 }]}>Total</Text>
                                {stats &&
                                    Object.entries(stats.globalMonthTotals).map(([month, total], i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cellHeader}>
                                            {(total.fonctionnaire && total.fonctionnaire[month]) ?? 0}
                                        </Text>
                                        <Text style={styles.cellHeader}>
                                            {(total.contractuel && total.contractuel[month]) ?? 0}
                                        </Text>
                                    </React.Fragment>
                                ))}
                                <React.Fragment>
                                    <Text style={styles.cellHeader}>
                                        {(stats.totalFonctionnaire || 0)}
                                    </Text>
                                    <Text style={styles.cellHeader}>
                                        {(stats.totalContractuel || 0)}
                                    </Text>
                                </React.Fragment>
                            </View>
                        )}
                    </View>
                </PageWithHeaderFooter>
            ))}
        </Document>
    );
};

export default NewStatsDoc;
