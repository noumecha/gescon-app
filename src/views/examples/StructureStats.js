import {
    Container,
    Row
  } from "reactstrap";
import Header from "components/Headers/Header.js";

const StructureStats = () => {

    return (
        <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col">
                    <div className="mt-3 alert alert-success" role="alert">
                        StructureStats
                    </div>
                </div>
            </Row>
        </Container>
      </>
    );
}

export default StructureStats;