import React from 'react';
import { Page, Text, View, Document,Image, StyleSheet } from '@react-pdf/renderer';
import image from './docs-images/sceau-img.PNG';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: 'white',
  },
  container: {
    display: 'flex',
    margin: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  containerTwo: {
    display: 'flex',
    margin: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
  containerThree: {
    display: 'flex',
    margin: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
  },
  h1CertifTitle: {
    fontSize: 15,
    marginTop: 3,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    textDecoration: 'underline',
  },
  h2CertifSubtitle: {
    fontSize: 14,
    marginTop: 3,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'center',
  },
  pCertifText: {
    marginTop: 3,
    fontSize: 12,
    textAlign: 'justify'
  },
  h1Title: {
    fontSize: 15,
    marginTop: 3,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center'
  },
  h4Title: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'center'
  },
  amTitle: {
    fontSize: 13,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 3,
    textDecoration: 'underline',
  },
  amParagraph: {
    fontSize: 13,    
    marginTop: 3,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  imageSceau: {
    height: 100,
    width: 100,
  }
});

// Create Document Component
const MyDocument = (props) => (
  <Document>
    <Page size="A4" style={styles.page}>
        {/* first row : entete */}
        <View style={styles.container}>
            {/* top left text */}
            <View style={styles.section}>
                <Text style={styles.h1Title}>
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
                    DIRECTION GENERAL DU BUDGET
                </Text>
                <Text>********</Text>
                <Text style={styles.h1Title}>
                    SOUS-DIRECTION DES AFFAIRES GENERAL
                </Text>
                <Text>********</Text>
                <Text style={styles.h1Title}>
                    SERVICE DU PERSONNEL
                </Text>
                <Text>********</Text>
                <Text style={styles.h4Title}>
                    N°__________________/CDC/MINFI/SG/DGB/SDAG/SP/AAN
                </Text>
            </View>
            {/* image */}
            <View style={styles.section}>
                <Image style={styles.imageSceau} src={image}/>
                {/*<Text style={styles.logoCenter}>
                    Image center    
                </Text>*/}    
            </View>
            {/* top right text */}
            <View style={styles.section}>
                <Text style={styles.h1Title}>
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
                <Text style={styles.h4Title}>
                    Yaoundé le 
                </Text>
            </View>
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
                    Le Directeur Général du Budget, sousigné, certifie que {"M(me)"} {props.name.toUpperCase()}, 
                    TYPE d'Administration, Mle {props.matricule.toUpperCase()}, en service au SERVICE est bénéficiaire
                    d'un {props.type}  consécutif de {props.duration} jours , accordé par décision N° {props.decision}
                    du DATE_DEC du Ministre des finances
                </Text>
                <Text style={styles.pCertifText}>
                    L'intéressé{"(e)"} jouira dudit congé pendant la période du DATE_DEBUT au DATE_FIN et 
                    reprendra le service DATE_FIN + 1 à 7 heures 30 précises.
                </Text>
                <Text style={styles.pCertifText}>
                    En foi de quoi, le présent certificat est établi et délivrée à l'intéressé{"(e)"} pour
                    servir et valoir ce que de droit./-
                </Text>
            </View>
        </View>
        <View style={styles.containerThree}>
            <View style={styles.section}>
                <Text style={styles.amTitle}>
                    Ampliations
                </Text>
                <Text style={styles.amParagraph}>
                    - minfi/cab
                </Text>
                <Text style={styles.amParagraph}>
                        - minfi/sg/drh
                </Text>
                <Text style={styles.amParagraph}>
                            - dgb/sdag/cfs-fs/df
                </Text>
                <Text style={styles.amParagraph}>
                                - interessee/dossier
                </Text>
                <Text style={styles.amParagraph}>
                                        - chrono/archives
                </Text>
            </View>
        </View>
    </Page>
  </Document>
);

export default MyDocument;