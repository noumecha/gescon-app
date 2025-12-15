
// Styles
import { StyleSheet, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../documents/docs-fonts/times new roman.ttf';
import TimesNewRomanBold from '../documents/docs-fonts/times new roman bold.ttf';
import TimesNewRomanItalic from '../documents/docs-fonts/times new roman bold italic.ttf';
Font.register({
    family: 'Times-Roman',
    fonts: [
        { src: TimesNewRoman },
        { src: TimesNewRomanItalic, fontStyle: 'italic' },
        { src: TimesNewRomanBold, fontWeight: 'bold' },
    ],
});
Font.registerHyphenationCallback(word => [word]);
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        fontFamily: 'Times-Roman',
        paddingHorizontal: 25,
        paddingVertical: 70,
        fontSize: 10,
    },
    // header
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        top: 15,
        left: 25,
        right: 25,
        textAlign: 'center',
        fontSize: 10,
        paddingBottom: 3,
    },
    topSectionOne: {
        fontSize: 9,
        flex: 1,
        textAlign: 'center',
        lineHeight: 1,
    },
    topSectionTwo: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 1,
    },
    // center first section logo
    topSectionImage: {
        position: 'absolute',
        left: "44%",
    },
    imageSceau: {
        height: 100,
        width: 100,
    },
    line: {
        textAlign: 'center',
        marginTop: -2,
        letterSpacing: 1,
    },
    h1TitleFirst: {
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    h1Title: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
    },
    h1TitleBold: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 3,
        fontFamily: 'Times-Bold',
        fontWeight: 'bold',
    },
    h4Title: {
        marginTop: 2,
        fontFamily: 'Times-BoldItalic',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    },
    // footer
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
    title: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginVertical: 10,
        textTransform: 'uppercase',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    table: {
        display: 'flex',
        borderWidth: 1,
        borderColor: '#000',
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    cellHeader: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        position: "relative",
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cellHeaderRightBorder: {
        flex: 1,
        borderRightWidth: 0.5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        position: "relative",
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cellHeaderLeftBorder: {
        flex: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0.5,
        borderColor: '#000',
        backgroundColor: '#eee',
        position: "relative",
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
    },
    cellHeaderNoBorderBottom: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        borderBottom: 'none',
    },
    cellHeaderNoBorderTop: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#eee',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        borderTop: 'none',
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 1.15,
    },
    cellRightBorder: {
        flex: 1,
        borderWidth: 1,
        borderRightWidth: 0.5,
        borderColor: '#000',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 1.15,
    },
    cellLeftBorder: {
        flex: 1,
        borderColor: '#000',
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 1.15,
        borderWidth: 1,
        borderLeftWidth: 0.5,
    },
    //
    text : {
        marginBottom: 20,
        position: "absolute",
    }
});

export default styles;