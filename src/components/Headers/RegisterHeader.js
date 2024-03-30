// reactstrap components
import { Container, Row, Col } from "reactstrap";

const RegisterHeader = () => {
  return (
    <>
      <div
        className="header d-flex align-items-center"
        style={{
          minHeight: "350px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="12" md="12">
              <h1 className="text-white text-center" style={{textAlign:"center"}}>AJOUTER UN NOUVEL UTILSATEUR !</h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RegisterHeader;
