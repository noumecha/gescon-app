/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Text, Document, View } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { chunkArray } from 'utils/stats-utils';
import { monthsNoYear as months, fullMonths } from 'utils/docs-utils';

const PersonStatsDoc = ({ stats, year, structure }) => {
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
                            {`STATISTIQUES DES CONGÉS -  ${year?.value || d.getFullYear()}`.toUpperCase()}
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
                                        flex: 2.09,
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
                                            {data.months[month] ? data.months[month] : "-"}
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
                                <Text style={[styles.cellHeader, { flex: 2.09 }]}>Total</Text>

                                {Object.entries(stats.globalMonthTotals).map(([month, total], i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cellHeader}>{total ?? 0}</Text>
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

export default PersonStatsDoc;
