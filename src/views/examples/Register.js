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
  Alert,
} from "reactstrap";
import RegisterHeader from "components/Headers/RegisterHeader";
import { useState } from "react";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const Register = () => {

  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState("");

  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!userData.name || !userData.email || !userData.password || !userData.telephone || !userData.role || !userData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setTimeout(() => {
        setError("");
      },7000)
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError('Les mots de passe ne sont pas identiques');
      setTimeout(() => {
        setError("");
        //setPwdMatch(true);
      },7000)
      return
    }
    setSuccess("Enregistré avec succès");
    console.log(userData)
  }
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value});
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
                    <h3 className="mb-0">Renseigner les informations</h3>
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
                            placeholder="Username"
                            defaultValue={userData.name}
                            onChange={handleChange}
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
                            onChange={handleChange}
                            defaultValue={userData.email}
                            name="email"
                            placeholder="jesse@example.com"
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
                            onChange={handleChange}
                            value={userData.telephone}
                            id="input-phone"
                            required
                            placeholder="First name"
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
                            type="select"
                            name="role"
                            required
                            onChange={handleChange}
                          >
                            <option key={"admin"}>Administrateur</option>
                            <option key={"utilisateur"}>Utilisateur</option>
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
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            name="password"
                            defaultValue={userData.password}
                            onChange={handleChange}
                            placeholder="mot_de_passe"
                            type="password"
                            required
                          />
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
                          <div class="mb-4 flex">
                            <Input
                              className="form-control-alternative"
                              id="input-password-confirm"
                              onChange={handleChange}
                              defaultValue={userData.confirmPassword}
                              name="confirmPassword"
                              placeholder="confirm_password"
                              type={showPwd ? "text" : "password"}
                              required
                            />
                            <span class="flex justify-around items-center" onClick={toggleShowPwd}>
                              <Icon class="absolute mr-10" icon={showPwd ? eye : eyeOff } size={25}/>
                            </span>
                          </div>
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
