import React from 'react';
import { Page, Text, View, Document,Image, StyleSheet } from '@react-pdf/renderer';
import image from './docs-images/sceau-img.PNG';

// Create styles
const styles = StyleSheet.create({
    // divider : 
    divider : {
      display: 'block',
      height: '2px',
      width: '200px',
      backgroundColor: '#000000',
      marginTop : 20,
    },
    // css table : 
    containerTable: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 20,
      marginLeft: 30,
      marginRight: 30,
    },
    h2CertifSubtitleTable: {
      fontSize: 12,
      marginTop: 3,
      marginBottom: 15,
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'center',
    },
    containerTableFirstRow: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'row',
    },
    containerTableFirstRowYear: {
      display: 'flex',
      padding: 7,
      fontSize: 12,
      width: 60,
      fontWeight: 'bold',
      textAlign: 'center',
      border: '1px solid black',
    },
    containerTableFirstRowTotal: {
      display: 'flex',
      padding: 7,
      fontSize: 12,
      fontWeight: 'bold',
      width: 60,
      textAlign: 'center',
      border: '1px solid black',
    },
    containerTableFirstRowHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    containerTableFirstRowHeader: {
      display: 'flex',
      padding: 7,
      fontSize: 12,
      textAlign: 'center',
      fontWeight: 'bold',
      width: 150,
      border: '1px solid black',
    },
    containerTableFirstRowContentContainer : {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      width: 150,
      padding: 0,
      margin: 0,
      fontSize: 12,
    },
    containerTableFirstRowContent : {
      flex: 1,
      paddingTop: 7,
      paddingBottom: 7,
      border: '1px solid black',
    },
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
const PersonnelDoc = (props) => {
  
  const d = new Date();

  return (
    <Document>
      <Page orientation='landscape' size="A4" style={styles.page}>
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
                      N°__________/MINFI/SG/DGB/SDAG/SP
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
                props.statistics.map((stat) => (
                  <View key={stat} style={styles.containerTableFirstRowHeaderContainer}>
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