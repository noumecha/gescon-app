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
    }
});

// Create Document Component
const PersonnelDoc = (props) => {

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
                    FICHE STATISTIQUES DE {props.name}
                  </Text>
                  <Text style={styles.h2CertifSubtitle}>
                    STATISTICAL SHEET OF {props.name}
                  </Text>
              </View>
          </View>
          {/** stats for conges */}
          {props.statistics && props.statistics.length > 0 ? (
            <View style={styles.containerTable}>
            <Text style={styles.h2CertifSubtitleTable}>
              STATISTIQUES DES CONGES : 
            </Text>
            {/** first row of the table */}
            <View style={styles.containerTableFirstRow}>
              <Text style={styles.containerTableFirstRowYear}>
                Annéés
              </Text>
              {props.statistics && props.statistics.length > 0 && (
                props.statistics.map((stat, index) => (
                  <View key={index} style={styles.containerTableFirstRowHeaderContainer}>
                    {stat.conges.map((c, index) => (
                    <Text key={c.id} style={styles.containerTableFirstRowHeader}>
                      Congé {parseInt(index + 1)}
                    </Text>
                  ))}
                  </View>
                ))
              )}
              <Text style={styles.containerTableFirstRowTotal}>
                Total
              </Text>
            </View>
            {/** second row of the table */}
            {props.statistics && props.statistics.length > 0 && (
              props.statistics.map((stat) => (
              <View key={stat} style={styles.containerTableFirstRow}>
                <Text style={styles.containerTableFirstRowYear}>
                  {stat.year}
                </Text>
                {stat.conges.map((c) => (
                  <View key={c} style={styles.containerTableFirstRowContentContainer}>
                    <Text style={styles.containerTableFirstRowContent}>
                      {c.dd}
                    </Text>
                    <Text style={styles.containerTableFirstRowContent}>
                      {c.df}
                    </Text>                    
                  </View>
                ))}
                {/** Total */}
                <Text style={styles.containerTableFirstRowTotal}>
                  {props.conges}
                </Text>
              </View>
              ))
            )}
            </View>
          ) : 
          (
            <View style={styles.containerTable}>
              <Text style={styles.h2CertifSubtitleTable}>
                AUCUN CONGE PRIS !
              </Text>
            </View>
          )}
          {/** stats for permissions */}
          {props.statisticsPermission && props.statisticsPermission.length > 0 ? (
            <View style={styles.containerTable}>
              <Text style={styles.h2CertifSubtitleTable}>
                STATISTIQUES DES PERMISSIONS : 
              </Text>
              {/** first row of the table */}
              <View style={styles.containerTableFirstRow}>
                <Text style={styles.containerTableFirstRowYear}>
                  Annéés
                </Text>
                {props.statisticsPermission && props.statisticsPermission.length > 0 && (
                  props.statisticsPermission.map((stat) => (
                    <View key={stat} style={styles.containerTableFirstRowHeaderContainer}>
                      {stat.permissions.map((p, index) => (
                        <Text key={stat} style={styles.containerTableFirstRowHeader}>
                          Permission {parseInt(index + 1)}
                        </Text>
                      ))}
                    </View>
                  ))
                )}
                <Text style={styles.containerTableFirstRowTotal}>
                  Total
                </Text>
              </View>
              {/** second row of the table */}
              {props.statisticsPermission && props.statisticsPermission.length > 0 && (
                props.statisticsPermission.map((stat) => (
                <View key={stat} style={styles.containerTableFirstRow}>
                  <Text style={styles.containerTableFirstRowYear}>
                    {stat.year}
                  </Text>
                  {stat.permissions.map((p) => (
                    <View key={p} style={styles.containerTableFirstRowContentContainer}>
                      <Text style={styles.containerTableFirstRowContent}>
                        {p.dd}
                      </Text>
                      <Text style={styles.containerTableFirstRowContent}>
                        {p.df}
                      </Text>                    
                    </View>
                  ))}
                  {/** Total */}
                  <Text style={styles.containerTableFirstRowTotal}>
                    {props.permissions}
                  </Text>
                </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.containerTable}>
              <Text style={styles.h2CertifSubtitleTable}>
                AUCUNE PERMISSION PRISE !
              </Text>
            </View>
          )}
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

export default PersonnelDoc;