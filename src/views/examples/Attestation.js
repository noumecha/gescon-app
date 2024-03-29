import {
    Container,
    Row
  } from "reactstrap";
import Header from "components/Headers/Header.js";

const Attestation = () => {

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col">
                    <div className="mt-3 alert alert-success" role="alert">
                        Page des attestations
                    </div>
                </div>
            </Row>
        </Container>
      </>
    );
}

export default Attestation;