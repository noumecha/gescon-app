import { Container } from "reactstrap";
import Header from "components/Headers/Header.js";
import { Row,Col,Card,CardHeader,CardBody,Button } from 'reactstrap';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import FicheSuivieDoc from "documents/FicheSuivieDoc";

const FicheSuivie = () => {
    const date = new Date().getDate() + '_' + parseInt(new Date().getMonth() + 1 )+ '_' + new Date().getFullYear()
    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
            <Row className="mt-5">
                <Col className="order-xl-1" md="12" lg="12">
                    <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                                <Col xs="8">
                                    <h3 className="mb-0">Télécharger la fiche de suivie de congé</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <PDFViewer showToolbar={0} className="w-100"  height={800}>
                                    <FicheSuivieDoc/>
                                </PDFViewer>
                            </Row>
                            <Row>
                                <Col className="order-xl-1 mt-2" xl="8">
                                    <PDFDownloadLink document={<FicheSuivieDoc             
                                        />} fileName={`fiche_suivie_conge_${date}.pdf`}>
                                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                                        <Button
                                            color="success"
                                        >
                                            Télécharger
                                        </Button>)}
                                    </PDFDownloadLink>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                </Row>
            </Container>
        </>
    );
}

export default FicheSuivie;