import React from 'react';
import { Page, Text, View, Document, Image} from '@react-pdf/renderer';
import { generateQRCode } from 'utils/generateQRCode';
import { styles, fontStyles } from 'utils/attestation-style';

// Create Document Component
const CongeDoc = (props) => {
    const d = new Date();
    const qrText = `GESCON-APP - ${d.getFullYear()} - ${d.getTime()}`;
    const [qrData, setQrData] = React.useState(null);
    React.useEffect(() => {
        generateQRCode(qrText).then(setQrData);
    }, []);

    return (
        <Document>
        <Page size="A4" style={styles.page}>
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
            <View style={styles.containerDateNumber}>
                <Text style={styles.h4TitleNumber}>
                    N°{new Date().getFullYear() % 100}/__________/MINFI/SG/DGB/SDAG/SP
                </Text>
                <Text style={styles.h4TitleDate}>
                    Yaoundé, le
                </Text>
            </View>
            <View style={styles.containerTwo}>
                <View style={styles.section}>
                    <Text style={styles.h1CertifTitle}>
                        CERTIFICAT DE DEPART EN CONGE
                    </Text>
                    <Text style={styles.h2CertifSubtitle}>
                        CERTIFICAT OF DEPARTURE ON LEAVE
                    </Text>
                    <Text style={styles.pCertifText}>
                        Le Directeur Général du Budget, soussigné, certifie que {props.sexe === "M" ? "Monsieur" : "Madame"} <Text style={fontStyles.bold}>{props.name+","}</Text> {props.grade},
                        <Text style={fontStyles.bold}> Matricule {props.matricule}</Text>, {props.poste} {props.preposition} {props.structure}, est bénéficiaire
                        d'un {props.typeConge} de (<Text style={fontStyles.bold}>{props.duration}</Text>)
                        {props.duration > 1 ? " jours" : " jour"}{props.type === "Contractuelle" ? " ouvrable" : ""}{(props.type === "Contractuelle" && props.duration > 1) ? "s" : ""},
                        accordé par décision <Text style={fontStyles.bold}>N°{props.decision}</Text> du Ministre des Finances.
                    </Text>
                    <Text style={styles.pCertifText}>
                        L'intéressé{props.sexe === "M" ? "" : "e"} jouira 
                        {props.numero_conge_admin !== 0 
                            ? props.numero_conge_admin === 1 
                                ? " de la première partie " 
                                : props.numero_conge_admin === 2 
                                    ? " de la deuxième partie " 
                                    : props.numero_conge_admin === 3 ?
                                    " de la troisième partie " 
                                    : " "
                            : " "}
                        dudit congé pendant la période allant du <Text style={fontStyles.bold}>{props.startDate}</Text> au <Text style={fontStyles.bold}>{props.endDate}</Text> et 
                        reprendra le service le <Text style={fontStyles.bold}>{props.repriseDate} à 7 heures 30 précises.</Text>
                    </Text>
                    <Text style={styles.pCertifText}>
                    En foi de quoi, le présent certificat est établi et délivré à l'intéressé{props.sexe === "M" ? "" : "e"} pour servir et valoir ce que de droit./-                                                                    
                    </Text>
                </View>
            </View>
            <View style={styles.containerThree}>
                <View style={styles.sectionLeftBottom}>
                    <Text style={styles.amTitle}>
                        Ampliations :
                    </Text>
                    <Text style={styles.amParagraph1}>
                        - minfi/cab
                    </Text>
                    <Text style={styles.amParagraph2}>
                        - minfi/sg/drh
                    </Text>
                    <Text style={styles.amParagraph3}>
                        - dgb/sdag
                    </Text>
                    <Text style={styles.amParagraph4}>
                        - dgb/{props.structure.match(/\[([^\]]+)\]/) 
                            ? props.structure.match(/\[([^\]]+)\]/)[1] 
                            : props.structure}
                    </Text>
                    <Text style={styles.amParagraph5}>
                        - interesse{props.sexe === "M" ? "" : "e"}/dossier
                    </Text>
                    <Text style={styles.amParagraph6}>
                        - chrono/archives
                    </Text>
                </View>
            </View>
            {/* Global Footer */}
            <View style={styles.footer} fixed>
                <Text>Généré le {d.toLocaleDateString()} à {d.toLocaleTimeString()}</Text>
                {qrData && <Image src={qrData} style={styles.qrCode} />}
            </View>
        </Page>
    </Document>
    );

};

export default CongeDoc;