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
  InputGroupText,
  Alert
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import { useAuth } from "services/AuthContext";
const bcrypt = require("bcryptjs")

const Profile = () => {

  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  const [error, setError] = useState("");
  const [errorPwd, setErrorPwd] = useState("");
  const [success, setSuccess] = useState("");
  const [successPwd, setSuccessPwd] = useState("");
  const [name, setName] = useState(user.nom_utilisateur);
  const [email, setEmail] = useState(user.email_utilisateur);
  const [role, setRole] = useState(user.role_utilisateur);
  const [telephone, setTelephone] = useState(user.telephone_utilisateur);
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

  const isValidEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // function for db 
  const updateUserInfo = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: name,
        email: email,
        telephone: telephone,
        updated_at: new Date().toISOString().slice(0,19).replace('T',' '),
        id_utilisateur : user.id_utilisateur,
      };
      if (!userData.name || !userData.email || !userData.telephone) {
        setError('Veuillez remplir tous les champs');
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (userData.telephone.length < 9) {
        setError('Le numero de téléphone doit contenir 9 chiffres minimum');
        setTimeout(() => {
          setError("");
        },7000)
        return
      }
      if (userData.telephone.length > 13) {
        setError('Le numero de téléphone ne peut pas dépasser 13 chiffres');
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
        const req_users = `UPDATE utilisateur SET nom_utilisateur = "${userData.name}",email_utilisateur = "${userData.email}",
        telephone_utilisateur = "${userData.telephone}", updated_at_utilisateur = "${userData.updated_at}" 
        WHERE id_utilisateur = ${userData.id_utilisateur}`;
        window.electronAPI.updateUser(req_users);
        await window.electronAPI.userUpdatedSuccess(() => {
          setSuccess(`Les informations de ${name} on été mis à jour`);
          setTimeout(() => {
            setSuccess("");
          }, 3000);
          console.log(userData)
        })
        setName("");
        setEmail("");
        setTelephone("");
        toogleDisable();
    } catch (error) {
      console.error(`Error on save user : ${error.message}`);
    }
  }

  const updateUserPwd = async (e) => {
    e.preventDefault();
    try {
      var salt = bcrypt.genSaltSync(10);
      var crypPwd = bcrypt.hashSync(pwd, salt);
      const psswd = crypPwd;
      if (!pwd || !confirmPwd) {
        setErrorPwd('Veuillez remplir tous les champs');
        setTimeout(() => {
          setErrorPwd("");
        },4000)
        return;
      }
      if (pwd.length < 8) {
        setErrorPwd('Le mot de passe doit contenir 8 carractères minimum');
        setTimeout(() => {
          setErrorPwd("");
        },4000)
        return
      }
      if (!bcrypt.compareSync(confirmPwd, psswd)) {
        setErrorPwd('Les mots de passe ne sont pas identiques');
        setTimeout(() => {
          setErrorPwd("");
        },4000)
        return
      }
      const req = `UPDATE utilisateur SET mdp_utilisateur = "${psswd}" WHERE id_utilisateur = ${user.id_utilisateur}`;
      window.electronAPI.updateUserPassword(req);
      await window.electronAPI.userPasswordUpdatedSuccess(() => {
        setSuccessPwd(`Le mot de passe de ${user.nom_utilisateur} a été modifié`);
        setTimeout(() => {
          setSuccessPwd("");
        },4000)
      })
      setPwd("");
      setConfirmPwd("");
      toggleDisablePwd();
    } catch (err) {
      console.log(`error on update password ${err.message}`)
    }
  }

  useEffect(() => {
    console.log(`User object : ${user}`);
  },[user]);

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
                    {user.nom_utilisateur}
                  </div>
                  <div className="h4 font-weight-300">
                    {user.email_utilisateur}
                  </div>
                  <div className="h4 mt-4">
                    {user.telephone_utilisateur}
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
                      <Col className="mt-3" lg="12">
                        {success && 
                          <Alert className="text-center" color="success">
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
                          onClick={(e) => updateUserInfo(e)}
                          disabled={disable}
                          size="md"
                        >
                          Enregistrer les modifications
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mt-3" lg="12">
                        {error && 
                          <Alert className="text-center" color="danger">
                            {error}
                          </Alert>
                        }
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
                  <Row>
                    <Col className="mt-3" lg="12">
                      {successPwd && 
                        <Alert className="text-center" color="success">
                          {successPwd}
                        </Alert>
                      }
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
                    </Row>
                    <Row>
                      <Col className="" lg="6">
                        <Button
                          color="success"
                          onClick={(e) => updateUserPwd(e)}
                          disabled={disablePwd}
                          size="md"
                        >
                          Mettre à jour
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mt-3" lg="12">
                        {errorPwd && 
                          <Alert className="text-center" color="danger">
                            {errorPwd}
                          </Alert>
                        }
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
