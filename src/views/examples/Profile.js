// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useState } from "react";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';

const Profile = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [disable, setDisable] = useState(true);
  const [disablePwd, setDisablePwd] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // usefull functions
  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }

  const toggleShowConfirmPwd = () => {
    setShowConfirmPwd(!showConfirmPwd);
  }

  const toogleDisable = () => {
    setDisable(!disable);
  }

  const toggleDisablePwd = () => {
    setDisablePwd(!disablePwd);
  }

  const handleInputChange = (stateFunction) => (e) => {
    stateFunction(e.target.value);
  }

  // function for db 
  const updateUserInfo = () => {
    console.log(`Update user info`);
  }

  const updateUserPwd = () => {
    console.log(`Update user pwd`);
  }

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center mb-7">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/user_good.png")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="my-4">
                <div className="text-center my-4">
                  <hr className="my-4" />
                  <div className="h4 font-weight-300">
                    Bucharest, Romania
                  </div>
                  <div className="h4 mt-4">
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div className="h4 mt-4">
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Mes informations</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <Button
                      color="primary"
                      onClick={() => toogleDisable()}
                      size="md"
                    >
                      Modifier mes informations
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nom
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={name}
                            id="input-username"
                            disabled={disable}
                            onChange={handleInputChange(setName)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Adresse email
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={email}
                            disabled={disable}
                            type="email"
                            onChange={handleInputChange(setEmail)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Téléphone
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-phone"
                            value={telephone}
                            disabled={disable}
                            onChange={handleInputChange(setTelephone)}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-role"
                          >
                            Role
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-role"
                            value={role}
                            onChange={handleInputChange(setRole)}
                            disabled
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="" lg="6">
                        <Button
                          color="success"
                          onClick={() => updateUserInfo()}
                          disabled={disable}
                          size="md"
                        >
                          Enregistrer les modifications
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <Row className="align-items-center">
                    <Col className="" xs="6">
                      <h6 className="heading-small text-muted mb-0">
                        informations de sécurité
                      </h6>
                    </Col>
                    <Col className="text-right" xs="6">
                      <Button
                        color="primary"
                        onClick={() => toggleDisablePwd()}
                        size="md"
                      >
                        Modifier le mot de passe
                    </Button>
                    </Col>
                  </Row>
                  <div className="pl-lg-4 mt-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-pwd"
                          >
                            Nouveau mot de passe
                          </label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              className="form-control-alternative"
                              id="input-pwd"
                              value={pwd}
                              disabled={disablePwd}
                              onChange={handleInputChange(setPwd)}
                              type={showPwd ? "text" : "password"}
                            />
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText onClick={toggleShowPwd}>
                                <Icon className="absolute mr-10" icon={showPwd ? eye : eyeOff } size={18}/>
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-confirm-pwd"
                          >
                            Confirmer le nouveau mot de passe
                          </label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              className="form-control-alternative"
                              id="input-pwd"
                              value={confirmPwd}
                              disabled={disablePwd}
                              onChange={handleInputChange(setConfirmPwd)}
                              type={showConfirmPwd ? "text" : "password"}
                            />
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText onClick={toggleShowConfirmPwd}>
                                <Icon  
                                  className="absolute mr-10" 
                                  icon={showConfirmPwd ? eye : eyeOff } 
                                  size={18}
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row><Row>
                      <Col className="" lg="6">
                        <Button
                          color="success"
                          onClick={() => updateUserPwd()}
                          disabled={disablePwd}
                          size="md"
                        >
                          Mettre à jour
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
