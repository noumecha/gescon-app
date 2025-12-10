/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Text, View, Document } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { makeBreakable, chunkArray } from 'utils/stats-utils';
import { months, fullMonths } from 'utils/docs-utils';

const GlobalStatsDoc = ({ stats, year }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);

    React.useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, []);

    if (!stats || !stats.stats) return null;

    const entries = Object.entries(stats.stats);
    const rowsPerPage = 14;
    
    const pages = stats.isGlobal ? [entries] : chunkArray(entries, rowsPerPage);

    return (
        <Document>
            {pages.map((pageEntries, pageIndex) => (
                <PageWithHeaderFooter key={pageIndex} pageIndex={pageIndex} qrData={qrData}>
                    
                    {/* Title */}
                    {pageIndex === 0 && (
                        <Text style={styles.title}>
                        {`FICHE STATISTIQUES DES CONGÉS ${year?.value || d.getFullYear()}`}
                        </Text>
                    )}

                    {/* Table */}
                    <View style={styles.table}>
                        <View>
                            <View style={styles.row}>
                                <Text style={[styles.cellHeaderNoBorderBottom, { flex: 2.03 }]}>
                                    {year && year.value}
                                </Text>
                                {months.map((m, i) => (
                                    <Text key={i} style={styles.cellHeader}>
                                        {m}
                                    </Text>
                                ))}
                                {/* Totals*/}
                                <Text style={styles.cellHeaderNoBorderBottom}></Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.cellHeaderNoBorderTop, { flex: 5 }]}>
                                    Structure
                                </Text>
                                {months.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <Text style={styles.cellHeader}>Fonct.</Text>
                                        <Text style={styles.cellHeader}>Contr.</Text>
                                    </React.Fragment>
                                ))}
                                {/* Totals */}
                                <View style={[styles.cellHeaderNoBorderTop, { flex: 2.45 }]}>
                                    <Text style={[styles.text, {left: 15, top: -6}]}>
                                        Total
                                    </Text>
                                </View>
                            </View>
                        </View>

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
                                    <Text style={[styles.cell, { flex: 2.47 }]}>{data.fonctionnaire?.total + data.contractuel?.total ?? 0}</Text>
                                </View>
                            ))
                        }

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
                                    <Text style={[styles.cellHeader, { flex: 2.47 }]}>
                                        {stats.totalFonctionnaire + stats.totalContractuel || 0}
                                    </Text>
                                </React.Fragment>
                            </View>
                        )}
                        {/* total global by month */}
                        {(stats.isGlobal || pageIndex === pages.length - 1) && (
                            <View style={styles.row}>
                                <Text style={[styles.cellHeader, { flex: 5 }]}>
                                    {"Totaux Mensuels"}
                                </Text>
                                {stats &&
                                    Object.entries(stats.globalMonthTotals).map(([month, total], i) => (
                                        <React.Fragment key={i}>
                                            <Text style={[styles.cellHeader, { flex: 2.47 }]}>
                                                {total.fonctionnaire + total.contractuel}
                                            </Text>
                                        </React.Fragment>
                                    ))}
                                <React.Fragment>
                                    <Text style={[styles.cellHeader, { flex: 2.47 }]}>
                                        {stats.totalFonctionnaire + stats.totalContractuel}
                                    </Text>
                                    <Text style={[styles.cellHeader, { flex: 2.47, color: '#eee' }]}>
                                        {stats.totalFonctionnaire + stats.totalContractuel || 0}
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