import React from 'react';
import { Page, Text, View, Document,Image, StyleSheet } from '@react-pdf/renderer';
import image from './docs-images/sceau-img.PNG';
//import QrCode from './QrCode';

// Create styles
const styles = StyleSheet.create({
    // the container element
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
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 10,
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
      marginTop: 30,
      marginLeft: 30,
      marginRight: 30,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    // footer left section
    sectionLeftBottom: {
      display: 'flex',
    },    
    sectionRightBottom: {
        display: 'flex',
    },
    section: {
      display: 'flex',
      alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        flex: 1,
    },
    topSectionImage: {
        alignItems: 'center',
        flex: 1,
        marginTop: -15,
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
    qrCode: {
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
const PermissionDoc = (props) => {

    /*const data = JSON.stringify({
        name: props.name,
        matricule : props.matricule,
    })*/

    const d = new Date();

    return (
        <Document>
        <Page size="A4" style={styles.page}>
            {/* first row : entete */}
            <View style={styles.container}>
                {/* top left text */}
                <View style={styles.topSection}>
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
                        N°__________/CDC/MINFI/SG/DGB/SDAG/SP
                    </Text>
                </View>
                {/* image */}
                <View style={styles.topSectionImage}>
                    <Image style={styles.imageSceau} src={image}/> 
                </View>
                {/* top right text */}
                <View style={styles.topSection}>
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
                        CERTIFICAT DE PERMISSION
                    </Text>
                    <Text style={styles.h2CertifSubtitle}>
                        CERTIFICAT OF PERMISSION
                    </Text>
                    <Text style={styles.pCertifText}>
                        Le Directeur Général du Budget, sousigné, certifie que {props.sexe === "M" ? "M" : "Mme"} {props.name}, 
                        {props.type} d'Administration, Mle {props.matricule}, {props.poste} en service au {props.structure} est bénéficiaire
                        d'une permission de {props.duration} jours , accordée par décision N° {props.decision}
                         {/*du DATE_DEC*/} du Ministre des finances.
                    </Text>
                    <Text style={styles.pCertifText}>
                        L'intéressé{props.sexe === "M" ? "" : "e"} jouira de ladite permission pendant la période du {props.startDate} au {props.endDate} et 
                        reprendra le service le {props.repriseDate} à 7 heures 30 précises.
                    </Text>
                    <Text style={styles.pCertifText}>
                        En foi de quoi, le présent certificat est établi et délivré à l'intéressé{props.sexe === "M" ? "" : "e"} pour
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
                        - dgb/sdag/cfs-fs/df
                    </Text>
                    <Text style={styles.amParagraph4}>
                        - interessee/dossier
                    </Text>
                    <Text style={styles.amParagraph5}>
                        - chrono/archives
                    </Text>
                </View>
                {/*<View style={styles.sectionRightBottom}>
                    <Image src={QrCode} style={styles.qrCode} />
                </View>*/}
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

export default PermissionDoc;