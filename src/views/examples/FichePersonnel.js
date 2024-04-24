import { useEffect, useState } from "react";
import Chart from "chart.js";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";
import { ChartExample3 } from "variables/charts";
// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";
import Header from "components/Headers/Header.js";

const FichePersonnel = () => {
  
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }

    useEffect(() => {
      const func = async () => {
        try {
          const title = `Gescon App - ${new Date().getFullYear()}`;
          window.electronAPI.setTitle(title);
          const res = await window.electronAPI.ping();
          console.log("Ping : " ,res);
        } catch (error) {
          console.error("Erreur trouvé : " + error);
        }
      }
    
      func()
    }, []);
  
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Personnels
                      </h6>
                      <h2 className="text-white mb-0">En congés</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <ChartExample3 />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  };  

export default FichePersonnel;