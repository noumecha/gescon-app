
// Styles
import { StyleSheet, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../documents/docs-fonts/times new roman.ttf';
import TimesNewRomanBold from '../documents/docs-fonts/times new roman bold.ttf';
import TimesNewRomanItalic from '../documents/docs-fonts/times new roman bold italic.ttf';
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
        marginLeft: 40,
        marginRight: 40,
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    containerThree: {
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: 30,
        marginLeft: 40,
        marginRight: 40,
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    // date year number and structure
    containerDateNumber: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 150,
        marginLeft: 60,
        marginRight: 60,
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
    amParagraph6: {
        fontSize: 10,    
        marginTop: 3,
        marginLeft: 30,
        textTransform: 'uppercase',
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
    //
    // header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        top: 15,
        left: 25,
        right: 25,
        textAlign: 'center',
        fontSize: 10,
        paddingBottom: 3,
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 25,
        right: 25,
        borderTop: '1 solid black',
        paddingTop: 3,
        fontSize: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qrCode: {
        width: 35,
        height: 35,
    },
});

export { styles , fontStyles };