import React from 'react';
import { Text, View, Document } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { makeBreakable, chunkArray } from 'utils/stats-utils';

const GlobalStatsDoc = ({ stats, year }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);

    React.useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, [qrText]);

    if (!stats || !stats.stats) return null;

    const entries = Object.entries(stats.stats);
    const rowsPerPage = 14;

    // ⚡ Si ce sont des statistiques globales, on n’applique pas de pagination
    const pages = stats.isGlobal ? [entries] : chunkArray(entries, rowsPerPage);

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
                                        {year && year.value}
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
                        {!stats?.isGlobal &&
                            pageEntries.map(([structure, data], idx) => (
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
                                    <Text style={styles.cell}>{data.fonctionnaire?.total ?? 0}</Text>
                                    <Text style={styles.cell}>{data.contractuel?.total ?? 0}</Text>
                                </View>
                            ))}

                        {/* Table Footer (always if global, or last page otherwise) */}
                        {(stats.isGlobal || pageIndex === pages.length - 1) && (
                            <View style={styles.row}>
                                <Text style={[styles.cellHeader, { flex: 5 }]}>
                                    {stats?.isGlobal ? "Total Global" : "Total"}
                                </Text>
                                {stats &&
                                    Object.entries(stats.globalMonthTotals).map(([month, total], i) => (
                                        <React.Fragment key={i}>
                                            <Text style={styles.cellHeader}>
                                                {total.fonctionnaire ?? 0}
                                            </Text>
                                            <Text style={styles.cellHeader}>
                                                {total.contractuel ?? 0}
                                            </Text>
                                        </React.Fragment>
                                    ))}
                                <React.Fragment>
                                    <Text style={styles.cellHeader}>
                                        {stats.totalFonctionnaire || 0}
                                    </Text>
                                    <Text style={styles.cellHeader}>
                                        {stats.totalContractuel || 0}
                                    </Text>
                                </React.Fragment>
                            </View>
                        )}
                    </View>
                </PageWithHeaderFooter>
            ))}
        </Document>
    );
}
export default GlobalStatsDoc;