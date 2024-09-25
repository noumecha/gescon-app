import React from 'react';
import { Page, Text, View, Document,Image, StyleSheet, Font } from '@react-pdf/renderer';
import image from './docs-images/sceau-img.PNG';
import TimesNewRoman from './docs-fonts/times new roman.ttf';
import TimesNewRomanBold from './docs-fonts/times new roman bold.ttf';

// Create styles
Font.register({ 
    family: 'Times-Roman', 
    fonts : [
        {src: TimesNewRoman},
        {src: TimesNewRomanBold, fontWeight: 700}
    ]
});
Font.registerHyphenationCallback(word => [word])
const fontStyles = StyleSheet.create({
    normal: {
        fontFamily: 'Times-Roman',
        fontWeight: 'normal',
    },
    bold: {
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
    }
})
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        display: 'flex',
        backgroundColor: 'white',
        overflow: 'hidden',
        position: 'absolute',
        fontFamily: 'Times-Roman',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        flexDirection: 'row',
        marginTop: 30,
    },
    containerTwo: {
        display: 'flex',
        marginLeft: 60,
        marginRight: 60,
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    containerThree: {
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: 30,
        marginLeft: 60,
        marginRight: 60,
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    containerDateNumber: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 60,
        marginRight: 60,
        justifyContent: 'space-evenly',
    },
    // footer left section
    sectionLeftBottom: {
      display: 'flex',
    },
    section: {
      display: 'flex',
    },
    topSectionOne: {
        fontSize: 9,
        flex: 1,
        textAlign: 'center',
        lineHeight: 1,
        marginLeft: -50,
    },
    topSectionTwo: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 1,
        marginRight: -60,
    },
    /*topSectionImage: {
        position: 'absolute',
        marginTop: -20,
        left: "44%",
    },*/
    // certif title
    h1CertifTitle: {
      fontSize: 14,
      marginTop: 25,
      display: 'flex',
      color: '#000000',
      textAlign: 'center',
      textDecoration: 'underline',
    },
    h2CertifSubtitle: {
      fontSize: 12,
      marginTop: 3,
      color: '#000000',
      textAlign: 'center',
    },
    // paragraphStyle:
    pCertifText: {
      marginTop: 15,
      fontSize: 12,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      textAlign: 'justify',
    },
    // top text title
    h1TitleFirst: {
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h1Title: {
        color: '#000000',
        textAlign: 'center'
    },
    h4Title: {
        fontFamily: 'Times-Bold',
        textTransform: 'italic',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h4TitleNumber: {
        fontSize: 10,
        marginTop: 10,
        color: '#000000',
        textAlign: 'center'
    },
    h4TitleDate: {
      fontSize: 10,
      marginTop: 10,
      color: '#000000',
      textAlign: 'center'
    },
    // on footer ampliations text
    amTitle: {
      fontSize: 12,
      textAlign: 'left',
      marginTop: 3,
      textDecoration: 'underline',
    },  
    amParagraph1: {
      fontSize: 10, 
      marginTop: 3,
      marginLeft: 5,
      textTransform: 'uppercase',
    },
    amParagraph2: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 10,
      textTransform: 'uppercase',
      textAlign: 'left',
    },
    amParagraph3: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 15,
      textTransform: 'uppercase',
    },
    amParagraph4: {
      fontSize: 10,    
      marginTop: 3,
      marginLeft: 20,
      textTransform: 'uppercase',
    },
    amParagraph5: {
        fontSize: 10,    
        marginTop: 3,
        marginLeft: 25,
        textTransform: 'uppercase',
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
        marginTop: 180,
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
    }
});

// Create Document Component
const CongeDoc = (props) => {

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
                    <Text style={styles.h4Title}>
                        PAIX-TRAVAIL-PATRIE
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        MINISTERE DES FINANCES
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        SECRETARIAT GENERAL
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        DIRECTION GENERALE DU BUDGET
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        SOUS-DIRECTION DES AFFAIRES GENERALES
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        SERVICE DU PERSONNEL
                    </Text>
                    <Text>--------</Text>
                </View>
                {/* image */}
                {/*<View style={styles.topSectionImage}>
                    <Image style={styles.imageSceau} src={image}/> 
                </View>*/}
                {/* top right text */}
                <View style={styles.topSectionTwo}>
                    <Text style={styles.h1TitleFirst}>
                        REPUBLIC OF CAMEROON
                    </Text>
                    <Text style={styles.h4Title}>
                        PEACE-WORK-FATHERLAND
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        MINISTRY OF FINANCE
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        GENERAL SECRETARIAT
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        GENERAL BUDGET DIRECTORATE
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        SUB-DIRECTION OF GENERAL AFFAIRS
                    </Text>
                    <Text>--------</Text>
                    <Text style={styles.h1Title}>
                        PERSONNEL DEPARTEMENT
                    </Text>
                    <Text>--------</Text>
                </View>
            </View>
            <View style={styles.containerDateNumber}>
                <Text style={styles.h4TitleNumber}>
                    N°{new Date().getFullYear() % 100}/__________/MINFI/SG/DGB/SDAG/SP
                </Text>
                <Text style={styles.h4TitleDate}>
                    Yaoundé le 
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
                        Le Directeur Général du Budget, sousigné, certifie que {props.sexe === "M" ? "M." : "Mme"} <Text style={fontStyles.bold}>{props.name}</Text>, {props.grade},
                        <Text style={fontStyles.bold}> Mle {props.matricule}</Text>, {props.poste} {props.preposition} {props.structure} est bénéficiaire
                        d'un {props.typeConge} de (<Text style={fontStyles.bold}>{props.duration}</Text>) {props.duration > 1 ? "jours" : "jour"}, accordé par décision <Text style={fontStyles.bold}>N°{props.decision}</Text> du Ministre des finances.
                    </Text>
                    <Text style={styles.pCertifText}>
                        L'intéressé{props.sexe === "M" ? "" : "e"} jouira dudit congé pendant la période allant du <Text style={fontStyles.bold}>{props.startDate}</Text> au <Text style={fontStyles.bold}>{props.endDate}</Text> et 
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
                        - dgb/sdag/cfs-fs/df
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

export default CongeDoc;