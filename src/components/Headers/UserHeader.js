// reactstrap components
import { Container, Row, Col } from "reactstrap";

const UserHeader = () => {

  const hours = new Date().getHours()

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "400px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/app_backgournd.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="12" md="10">
              <h1 className="display-2 text-white">
                {
                  hours > 6 && hours < 20 ? "Bonjour XXX" : "Bonsoir XXX"
                }
              </h1>
              <p className="text-white mt-0 mb-5">
                Sur cette page vous pouvez modifier vos informations de connexion et vos paramètres
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
