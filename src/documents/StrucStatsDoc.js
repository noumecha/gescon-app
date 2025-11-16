import React, { useEffect, useMemo, useState } from 'react';
import { Text, Document, View } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { chunkArray } from 'utils/stats-utils';

const StructStatsDoc = ({ stats, year, structure }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, []);

    //if (!stats || !stats.stats) return null;

    const entries = Object.entries(stats.stats);

    // 👇 NEW: Two different row-per-page values
    const firstPageRows = 10;
    const otherPageRows = 13;

    // 👇 NEW: Build pages with different sizes
    const pages = useMemo(() => {
        const firstPage = entries.slice(0, firstPageRows);
        const remaining = entries.slice(firstPageRows);
        const restPages = chunkArray(remaining, otherPageRows);
        return [firstPage, ...restPages];
    }, [entries]);

    const months = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Jui",
        "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const fullMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    return (
        <Document>
            {pages.map((pageEntries, pageIndex) => (
                <PageWithHeaderFooter
                    key={pageIndex}
                    pageIndex={pageIndex}
                    qrData={qrData}
                    hasFullHeader={pageIndex === 0}   // 👈 NEW FLAG
                >
                    {/* 👇 ONLY FIRST PAGE SHOWS THE TITLE HEADER */}
                    {pageIndex === 0 && (
                        <Text style={styles.title} break>
                            {`STATISTIQUES DES CONGÉS - ${structure?.value || 'Structure'} -  ${year?.value || d.getFullYear()}`.toUpperCase()}
                        </Text>
                    )}

                    {/* TABLE */}
                    <View style={styles.table}>

                        {/* Table Header */}
                        <View>
                            <View style={styles.row}>
                                <Text style={[styles.cellHeaderNoBorderBottom, { flex: 2.09 }]}>
                                    {year && year.value}
                                </Text>
                                {months.map((m, i) => (
                                    <Text key={i} style={styles.cellHeader}>{m}</Text>
                                ))}
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.cellHeaderNoBorderTop, { flex: 5 }]}>
                                    {(structure?.value || 'Structure').toUpperCase()}
                                </Text>
                                {months.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cellHeader}>Fnc</Text>
                                        <Text style={styles.cellHeader}>Con</Text>
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>

                        {/* Table Body */}
                        {pageEntries.map(([personnel, data], idx) => (
                            <View key={idx} style={styles.row} wrap={false}>
                                {/* Name */}
                                <Text
                                    style={{
                                        ...styles.cell,
                                        textAlign: "left",
                                        paddingLeft: 3,
                                        flex: 5,
                                        flexWrap: "wrap",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {personnel}
                                </Text>

                                {/* Monthly data */}
                                {fullMonths.map((month, i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cell}>
                                            {data.fonctionnaire && data.months[month] ? data.months[month] : "-"}
                                        </Text>
                                        <Text style={styles.cell}>
                                            {data.contractuel && data.months[month] ? data.months[month] : "-"}
                                        </Text>
                                    </React.Fragment>
                                ))}

                                {/* Totals
                                <Text style={styles.cell}>{data.fonctionnaire ? data.total : 0}</Text>
                                <Text style={styles.cell}>{data.contractuel ? data.total : 0}</Text>*/}
                            </View>
                        ))}

                        {/* FOOTER TOTALS ONLY ON LAST PAGE */}
                        {pageIndex === pages.length - 1 && (
                            <View style={styles.row}>
                                <Text style={[styles.cellHeader, { flex: 5 }]}>Total</Text>

                                {Object.entries(stats.globalMonthTotals).map(([month, total], i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cellHeader}>{total.fonctionnaire ?? 0}</Text>
                                        <Text style={styles.cellHeader}>{total.contractuel ?? 0}</Text>
                                    </React.Fragment>
                                ))}

                                {/*<Text style={styles.cellHeader}>{stats.totalFonctionnaire || 0}</Text>
                                <Text style={styles.cellHeader}>{stats.totalContractuel || 0}</Text>*/}
                            </View>
                        )}
                    </View>
                </PageWithHeaderFooter>
            ))}
        </Document>
    );
};

export default StructStatsDoc;
