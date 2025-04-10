/* eslint-disable no-unused-vars */
// reactstrap components
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  Row,
  Alert,
} from "reactstrap";
import { useAuth } from "services/AuthContext";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
const bcrypt = require("bcryptjs")

const Login = ({ onLogin }) => {

  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }

  function handleLogin() {
    /*if (!password || !username) {
      setError('Renseigner vos informations de connexion!');
      setTimeout(() => {
        setError("");
      },4000)
      return;
    }
   const matchedUser = users.find(
      (user) => user.nom_utilisateur === username && bcrypt.compareSync(password, user.mdp_utilisateur)
    );
    if (matchedUser) {
      login(matchedUser);
    } else {
      setError("nom d'utilisateur ou mot de passe incorrect");
      setTimeout(() => {
        setError("");
      },4000);
    }*/
    login(users[0]);
  }

  const fetchUsers = async () => {
    try {
      window.electronAPI.getUsers();
      await window.electronAPI.retrieveUsers((event, res) => {
        setUsers(res);
      })
    } catch (error) {
        console.error("Erreur : " + error.message);
    }
  }

  useEffect (() => {
    fetchUsers();
  }, [])

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2">
              <h2>Connectez-vous</h2>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 pt-0 py-lg-5">
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nom d'utilisateur"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Mot de passe"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPwd ? "text" : "password"}
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText onClick={toggleShowPwd}>
                      <Icon className="absolute mr-10" icon={showPwd ? eye : eyeOff } size={18}/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <Row>
                <Col lg="12">
                  {error && 
                    <Alert className="text-center" color="danger">
                      {error}
                    </Alert>
                  }
                </Col>
              </Row>
              <div className="text-center">
                <Button onClick={handleLogin} className="" color="primary" type="button">
                  Se Connecter
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
