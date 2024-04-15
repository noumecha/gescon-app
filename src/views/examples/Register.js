import {
  Button,
  Card,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
import RegisterHeader from "components/Headers/RegisterHeader";
import { useState } from "react";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import bcryptjs from "bcryptjs";

const Register = () => {

  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [success, setSuccess] = useState("");
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const roles = ["administrateur", "utilisateur"];
  const [role, setRole] = useState(roles.length > 0 ? roles[0] : "");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }

  const toggleShowConfirmPwd = () => {
    setShowConfirmPwd(!showConfirmPwd);
  }

  const handleInputChange = (changeState) =>  (e) => {
    changeState(e.target.value)
  }

  const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name: name,
      email: email,
      role: role,
      telephone: telephone,
      password: password,
    };
    if (!userData.name || !userData.email || !userData.password || !userData.telephone || !userData.role || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setTimeout(() => {
        setError("");
      },7000)
      return;
    }
    if (userData.password !== confirmPassword) {
      setError('Les mots de passe ne sont pas identiques');
      setTimeout(() => {
        setError("");
      },7000)
      return
    }
    if (userData.telephone.length < 9) {
      setError('Le numero de téléphone doit contenir 9 chiffre minimum');
      setTimeout(() => {
        setError("");
      },7000)
      return
    }
    if (!isValidEmail(userData.email)) {
      setError('L\'adresse email n\'est pas valide');
      setTimeout(() => {
        setError("");
      },7000)
      return
    }
    bcryptjs.hash(password, 10, (err, hash) => {
      if (err) throw err;
      userData.password = hash;
    })
    //await window.electronAPI.addUsers();
    setSuccess("Enregistré avec succès");
    setTimeout(() => {
      setSuccess("");
    }, 3000);
    console.log(userData)
    setName("");
    setEmail("");
    setTelephone("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <RegisterHeader />
      {/* Page content */}
      <Container className="mt--7">
        <Row>
          <Col className="order-xl-1" lg="12" md="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col lg="12">
                    <h3 className="mb-0">Ajouter un nouvel utilisateur</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Information sur l'utilisateur
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        { success && 
                          <Alert color="success">
                            {success}
                          </Alert>
                        }
                      </Col>
                    </Row>
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
                            id="input-username"
                            name="name"
                            value={name}
                            onChange={handleInputChange(setName)}
                            required
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
                            Adresse Mail
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            onChange={handleInputChange(setEmail)}
                            value={email}
                            name="email"
                            type="email"
                            required
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
                            Telephone
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="telephone"
                            onChange={handleInputChange(setTelephone)}
                            value={telephone}
                            id="input-phone"
                            required
                            type="number"
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
                            type="select"
                            name="role"
                            required
                            onChange={handleInputChange(setRole)}
                          >
                            {roles && roles.length > 0 
                              ? roles.map((r) => (
                                <option key={r}>{r}</option>
                              ))
                              : (<option>Selectionner le rôle</option>)
                            }
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Information de sécurité
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Mot de passe
                          </label>
                          <InputGroup className="input-group-alternative">
                              <Input
                                //className="form-control-alternative"
                                id="input-password"
                                onChange={handleInputChange(setPassword)}
                                value={password}
                                name="password"
                                type={showPwd ? "text" : "password"}
                                required
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
                            htmlFor="input-password-confirm"
                          >
                            Confirmer le mot de passe 
                          </label>
                          <InputGroup className="input-group-alternative">
                              <Input
                                //className="form-control-alternative"
                                id="input-password-confirm"
                                onChange={handleInputChange(setConfirmPassword)}
                                value={confirmPassword}
                                name="confirmPassword"
                                type={showConfirmPwd ? "text" : "password"}
                                required
                              />
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText onClick={toggleShowConfirmPwd}>
                                  <Icon className="absolute mr-10" icon={showConfirmPwd ? eye : eyeOff } size={18}/>
                                </InputGroupText>
                              </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        { error && 
                          <Alert color="danger">
                            {error}
                          </Alert>
                        }
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <Button
                          color="primary"
                          onSubmit={onSubmit}
                          onClick={onSubmit}
                        >
                          Enregister l'utilisateur
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

export default Register;
