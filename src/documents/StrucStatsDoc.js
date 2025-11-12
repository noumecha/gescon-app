import React, { useEffect } from 'react';
import { Text, Document, View } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { chunkArray } from 'utils/stats-utils';

const StructStatsDoc = ({ stats, year, structure }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);

    useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, []);

    if (!stats || !stats.stats) return null;

    const entries = Object.entries(stats.stats);
    const rowsPerPage = 10;
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
                <PageWithHeaderFooter key={pageIndex} pageIndex={pageIndex} qrData={qrData}>
                    
                    {/* Title */}
                    {pageIndex === 0 && (
                    <Text style={styles.title} break>
                        {`STATISTIQUES DES CONGÉS - ${structure?.value || 'Structure'} -  ${year?.value || d.getFullYear()}`.toUpperCase()}
                    </Text>)}

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
                                        {`${structure?.value || 'Structure'}`.toUpperCase()}
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
                        {pageEntries.map(([personnel, data], idx) => (
                            <View key={idx} style={styles.row} wrap={false}>
                                {/* Personnel Name */}
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
                                    {personnel}
                                </Text>

                                {/* Monthly Data */}
                                {fullMonths.map((month, i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cell}>
                                            {(data.fonctionnaire && data.months[month]) ? data.months[month] : "-"}
                                        </Text>
                                        <Text style={styles.cell}>
                                            {(data.contractuel && data.months[month]) ? data.months[month] : "-"}
                                        </Text>
                                    </React.Fragment>
                                ))}
                                {/* Totals */}
                                <Text style={styles.cell}>{data.fonctionnaire ? data.total : 0}</Text>
                                <Text style={styles.cell}>{data.contractuel ? data.total : 0}</Text>
                            </View>
                        ))}

                        {/* Table Footer (always if global, or last page otherwise) */}
                        {(pageIndex === pages.length - 1) && (
                            <View style={styles.row}>
                                <Text style={[styles.cellHeader, { flex: 5 }]}>
                                    {"Total"}
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

export default StructStatsDoc;