import React from 'react';
import { Text, Document, View } from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import styles from 'utils/styles';
import PageWithHeaderFooter from 'utils/PageWithHeaderFooter';
import { makeBreakable, chunkArray } from 'utils/stats-utils';

const StructStatsDoc = ({ stats, year, structure }) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);

    React.useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, [qrText]);

    if (!stats || !stats.stats) return null;

    const entries = Object.entries(stats.stats);
    const rowsPerPage = 20; 
    const pages = chunkArray(entries, rowsPerPage);

    return (
        <Document>
            {pages.map((pageEntries, pageIndex) => (
                <PageWithHeaderFooter key={pageIndex} qrData={qrData}>
                    {/* Title */}
                    <Text style={styles.title} break>
                        {`STATISTIQUES DES CONGÉS - ${structure?.label || 'Structure'}`.toUpperCase()}
                    </Text>
                    <Text style={styles.subtitle}>
                        ANNÉE : {year?.value || d.getFullYear()}
                    </Text>

                    {/* Table */}
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.row} fixed>
                            <Text style={[styles.cellHeader, { flex: 3 }]}>Nom de l'employé</Text>
                            <Text style={[styles.cellHeader, { flex: 2 }]}>Date de début</Text>
                            <Text style={[styles.cellHeader, { flex: 2 }]}>Date de fin</Text>
                            <Text style={[styles.cellHeader, { flex: 1 }]}>Durée</Text>
                            <Text style={[styles.cellHeader, { flex: 1 }]}>Type</Text>
                        </View>

                        {/* Table Body */}
                        {pageEntries.map(([employeeName, conges], idx) => (
                            <React.Fragment key={idx}>
                                {conges.map((conge, congeIdx) => (
                                    <View key={`${idx}-${congeIdx}`} style={styles.row} wrap={false}>
                                        <Text style={[styles.cell, { flex: 3, textAlign: 'left', paddingLeft: 3 }]}>
                                            {congeIdx === 0 ? makeBreakable(employeeName) : ''}
                                        </Text>
                                        <Text style={[styles.cell, { flex: 2 }]}>{conge.startDate}</Text>
                                        <Text style={[styles.cell, { flex: 2 }]}>{conge.endDate}</Text>
                                        <Text style={[styles.cell, { flex: 1 }]}>{conge.duration}</Text>
                                        <Text style={[styles.cell, { flex: 1 }]}>{conge.type}</Text>
                                    </View>
                                ))}
                            </React.Fragment>
                        ))}
                    </View>
                </PageWithHeaderFooter>
            ))}
        </Document>
    );
}

export default StructStatsDoc;