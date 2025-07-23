import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';//Image,
//import image from './docs-images/sceau-img.PNG';
import TimesNewRoman from './docs-fonts/times new roman.ttf';
import TimesNewRomanBold from './docs-fonts/times new roman bold.ttf';
import TimesNewRomanItalic from './docs-fonts/times new roman bold italic.ttf';

// Create styles
Font.register({ 
    family: 'Times-Roman', 
    fonts : [
        {src: TimesNewRoman},
        {src: TimesNewRomanItalic},
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
    },
    italic: {
        fontFamily: 'Times-BoldItalic',
        fontStyle: 'italic',
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
    // date year number and structure
    containerDateNumber: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 30,
        marginRight: 30,
        //justifyContent: 'space-between',
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
      marginLeft: 160,
      color: '#000000',
      textAlign: 'center'
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
    h1CirculationTitle : {
        fontSize: 14,
        marginTop: 25,
        display: 'flex',
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
    // for the -------- 
    line: {
        textAlign: 'center',
        marginTop: -2,
        letterSpacing: 1,
    },
    //
    h1TitleFirst: {
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h1TitleBold: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
    },
    h1Title: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
    },
    h4Title: {
        marginTop: 2,
        fontFamily: 'Times-BoldItalic',
        fontStyle: 'italic',
        fontWeight: 'bold',
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
        marginTop: 270,
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
    },
    // table with css 
    containerTableFirstRow1st : {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginLeft: 60,
        marginRight: 60,
    },
    containerTableFirstRow : {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 60,
        marginRight: 60,
    },
    containerTableFirstRowTd : {
        border: '1px solid black',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: 200,
        padding: 15,
        fontSize: 10,
    },
    // object section 
    sectionObject : {
        display : 'flex',
        marginTop : 5,
        alignItems : 'center',
        flexDirection : 'row',
    },
    sectionObjectTitle : {
        fontSize: 12,
        textTransform : 'capitalize',
        textDecoration : 'underline',
    },
    sectionObjectText : {
        fontSize: 12,
    },
    sectionObjectName : {
        fontSize: 12,
        fontWeight : 'bold',
    }
});

// Create Document Component
const FicheSuivieDoc = (props) => {
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
                <View style={styles.containerTwo}>
                    <View style={styles.section}>
                        <Text style={styles.h1CirculationTitle}>
                            FICHE DE CIRCULATION DES DOSSIERS
                        </Text>
                        <Text style={styles.h2CertifSubtitle}>
                            ***********************
                        </Text>
                    </View>
                </View>
                <View style={styles.containerTwo}>
                    <View style={styles.sectionObject}>
                        <Text style={styles.sectionObjectTitle}>
                            Objet : 
                        </Text>
                        <Text style={styles.sectionObjectText}>
                            Certificat de départ en congé de {" "}
                        </Text>
                        <Text style={styles.sectionObjectName}>
                            [M/Mme] [Nom et Prénom]
                        </Text>
                    </View>
                </View>
                <View style={styles.containerTable}>
                    {/** first table */}
                    <View style={styles.containerTableFirstRow1st}>
                        <Text style={styles.containerTableFirstRowTd}>
                            responsable
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            Entrée
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            sortie
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            visa
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            secretaire générale
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            responsable
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            inspecteur générale
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            directeur général
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            conseiller technique
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            directeur
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            sous-directeur
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            chef de service
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            chef de bureau
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            cadre
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                    </View>
                    <View style={styles.containerTableFirstRow}>
                        <Text style={styles.containerTableFirstRowTd}>
                            courier
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
                        </Text>
                        <Text style={styles.containerTableFirstRowTd}>
                            
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
}

export default FicheSuivieDoc;