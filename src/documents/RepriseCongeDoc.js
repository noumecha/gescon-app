import React from 'react';
import { Page, Text, View, Document,Image, StyleSheet } from '@react-pdf/renderer';
import image from './docs-images/sceau-img.PNG';

// Create styles
const styles = StyleSheet.create({
    // the container element    
    boldText: {
        fontWeight: 'bold font',
    },
    page: {
      flexDirection: 'column',
      display: 'flex',
      backgroundColor: 'white',
      overflow: 'hidden',
      fontWeight: 'normal',
      position: 'absolute',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      flexDirection: 'row',
      marginTop: 40,
    },
    containerTwo: {
      display: 'flex',
      marginLeft: 30,
      marginRight: 30,
      justifyContent: 'space-evenly',
      flexDirection: 'column',
    },
    containerThree: {
      display: 'flex',
      alignItems: 'flex-start',
      marginTop: 30,
      marginLeft: 30,
      marginRight: 30,
      justifyContent: 'space-evenly',
      flexDirection: 'column',
    },
    // footer left section
    sectionLeftBottom: {
      display: 'flex',
    },
    section: {
      display: 'flex',
      alignItems: 'center',
    },
    topSectionOne: {
        flex: 1,
        textAlign: 'center',
        marginLeft: -50,
    },
    topSectionTwo: {
        flex: 1,
        textAlign: 'center',
        marginRight: -65,
    },
    topSectionImage: {
        position: 'absolute',
        marginTop: -20,
        left: "44%",
    },
    // certif title
    h1CertifTitle: {
      fontSize: 14,
      marginTop: 25,
      display: 'flex',
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      textDecoration: 'underline',
    },
    h2CertifSubtitle: {
      fontSize: 12,
      marginTop: 3,
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'center',
    },
    // paragraphStyle:
    pCertifText: {
      marginTop: 15,
      fontSize: 12,
      display: 'flex',
      textAlign: 'justify'
    },
    // top text title
    h1TitleFirst: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center'
    },
    h1Title: {
        fontSize: 10,
        marginTop: -5,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h4Title: {
        fontSize: 10,
        marginTop: -5,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'center'
    },
    h4TitleNumber: {
        fontSize: 10,
        marginTop: 10,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h4TitleDate: {
      fontSize: 10,
      marginTop: 10,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center'
    },
    // on footer ampliations text
    amTitle: {
      fontSize: 12,
      textAlign: 'left',
      fontWeight: 'bold',
      marginTop: 3,
      textDecoration: 'underline',
    },  
    amParagraph1: {
      fontSize: 10, 
      marginTop: 3,
      marginLeft: 5,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    amParagraph2: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 10,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    amParagraph3: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 15,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    amParagraph4: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 20,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    amParagraph5: {
        fontSize: 10,    
        marginTop: 3,
        marginLeft: 25,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    // center first section logo
    imageSceau: {
        height: 100,
        width: 100,
    }, 
    // center text : 
    containerQr: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 40,
    },
    sectionQr: {
      display: 'flex',
      alignItems: 'center',
    },
    qrText: {
        textAlign: 'center',
        fontSize: 10, 
        marginTop: 3,
        marginLeft: 5,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    }
});

// Create Document Component
const RepriseCongeDoc = (props) => {

    const d = new Date();

    return (
        <Document>
        <Page size="A4" style={styles.page}>
            {/* first row : entete */}
            <View style={styles.container}>
                {/* top left text */}
                <View style={styles.topSectionOne}>
                    <Text style={styles.h1TitleFirst}>
                        REPUBLIQUE DU CAMEROUN
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h4Title}>
                        Paix-Travail-Patrie
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        MINISTERE DES FINANCES
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        SECRETARIAT GENERAL
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        DIRECTION GENERALE DU BUDGET
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        SOUS-DIRECTION DES AFFAIRES GENERALES
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        SERVICE DU PERSONNEL
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h4TitleNumber}>
                        N°__________/CRS/MINFI/SG/DGB/SDAG/AAN
                    </Text>
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
                    <Text>********</Text>
                    <Text style={styles.h4Title}>
                        Peace work home
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        MINISTRY OF FINANCE
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        GENERAL SECRETARIAT
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        GENERAL BUDGET DIRECTORATE
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        SUB-DIRECTION OF GENERAL AFFAIRS
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h1Title}>
                        PERSONNEL DEPARTEMENT
                    </Text>
                    <Text>********</Text>
                    <Text style={styles.h4TitleDate}>
                        Yaoundé le ___________________
                    </Text>
                </View>
            </View>
            <View style={styles.containerTwo}>
                <View style={styles.section}>
                    <Text style={styles.h1CertifTitle}>
                        CERTIFICAT DE REPRISE DE SERVICE
                    </Text>
                    <Text style={styles.h2CertifSubtitle}>
                        CERTIFICATE OF RESUMPTION OF FUNCTION
                    </Text>
                    <Text style={styles.pCertifText}>
                        Le Directeur Général du Budget, sousigné, certifie que {props.sexe === "M" ? "M." : "Mme"} <Text style={styles.boldText}>{props.name}</Text>, 
                         {props.grade}, Matricule {props.matricule}, {props.poste} {props.preposition} {props.structure}, bénéficiaire
                        d'un {props.typeConge} de {props.duration} jours, accordé par décision N° <Text style={styles.boldText}>{props.decision}</Text> du Ministre des Finances,
                         allant du <Text style={styles.boldText}>{props.startDate}</Text> au <Text style={styles.boldText}>{props.endDate}</Text> a effectivement repris le service le <Text style={styles.boldText}>{props.repriseDate}</Text> à 7 heures 30 précises.
                    </Text>
                    <Text style={styles.pCertifText}>
                        En foi de quoi, le présent certificat de reprise de service est établi et délivré à l'intéressé{props.sexe === "M" ? "" : "e"} pour
                        servir et valoir ce que de droit./-
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
                        - minfi/dgb/sdag
                    </Text>
                    <Text style={styles.amParagraph4}>
                        - interessee/dossier
                    </Text>
                    <Text style={styles.amParagraph5}>
                        - chrono/archives
                    </Text>
                </View>
            </View>
            <View style={styles.containerQr}>
                <View style={styles.sectionQr}>
                    <Text style={styles.qrText}>
                        GESCON-APP - {d.getTime()} - {d.getFullYear()}
                    </Text>
                </View>
            </View>
        </Page>
      </Document>
    );

};

export default RepriseCongeDoc;