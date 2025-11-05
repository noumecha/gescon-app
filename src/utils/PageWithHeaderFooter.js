import { Text, Page, View, Image } from '@react-pdf/renderer';
import image from '../documents/docs-images/sceau-img.PNG'
import styles from 'utils/styles';

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
                {/* image */}
                <View style={styles.topSectionImage}>
                    <Image style={styles.imageSceau} src={image}/>
                </View>
                {/* top right text */}
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

export default PageWithHeaderFooter;