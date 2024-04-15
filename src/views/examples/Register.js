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
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import RegisterHeader from "components/Headers/RegisterHeader";
import { useState, useEffect } from "react";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
//import {bcryptjs} from "bcryptjs";
const bcrypt = require("bcryptjs")

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
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage] = useState(100);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [actionType, setActionType] = useState(false);
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState(0);
  const [message, setMessage] = useState("Ajouter un nouvel utilisateur");
  const loadingText = "Aucun utilisateur dans la base de données";

  const filterUsers = search !== "" || statutFilter !== ""
  ? users.filter(user => user.role_utilisateur.includes(statutFilter) && (
    user.nom_utilisateur.toLowerCase().includes(search.toLowerCase())
  ))
  : users

  const handlePageChange = ({selected}) => {
    setPageNumber(selected);
  }
  const handlePagePrev = () => {
    setPageNumber(pageCount <= 1 || pageNumber === 0 ? pageNumber : pageNumber - 1);
  }
  const handlePageNext = () => {
    setPageNumber(pageCount <= 1 || pageCount === pageNumber + 1 ? pageNumber : pageNumber + 1);
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleRefresh = () => {
    try {
      setLoadingSpinner(true);
      setTimeout(() => {
        setLoadingSpinner(false)
      }, 3000);
      fetchDatas();
      console.log("datas refreshed successfully");
    } catch (err) {
      console.error("error on refresh : " + err.message);
    }
  }

  const handleStatutFilter = (e) => {
    setStatutFilter(e.target.value);
  }  

  const pageCount = Math.ceil(users.length/perPage);
  const offset = pageNumber * perPage;

  const deleteUser = async (u) => {
    try {
      const req_user = `DELETE FROM utilisateur WHERE id_utilisateur = ${u.id_utilisateur}`;
      window.electronAPI.delUser(req_user);
      await window.electronAPI.userDeletedSuccess(() => {
        setDeleteSuccess(`Utilisateur ${u.nom_utilisateur} supprimé avec succès`);
        setTimeout(() => {
          setDeleteSuccess("");
        }, 3000);
      })
      await handleRefresh();
    } catch (e) {
      console.error(`error on delete : ${e.message}`);
    }
  }

  const updatePassword = (u) => {
    console.log(`update password for user : ${u.nom_utilisateur}`)
  }

  const editUser = (u) => {
    try {
      setActionType(true);
      setDisable(true);
      setMessage(`Modifier les informations de ${u.nom_utilisateur}`);
      setName(u.nom_utilisateur);
      setEmail(u.email_utilisateur);
      setRole(u.role_utilisateur);
      setId(u.id_utilisateur);
      setTelephone(u.telephone_utilisateur)
    } catch (error) {
      console.error(`error on edit : ${error.message}`);
    }
  }

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

  const fetchDatas = async () => {
    try {
      window.electronAPI.getUsers();
      await window.electronAPI.retrieveUsers((event, res) => {
        setUsers(res);
        setTimeout(() => 
        setLoadingSpinner(false)
        , 3000);
      })
    } catch (error) {
        console.error("Erreur : " + error.message);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      var salt = bcrypt.genSaltSync(10);
      var crypPwd = bcrypt.hashSync(password, salt);
      /*bcryptjs.hash(password, 10, (err, hash) => {
        if (err) throw err;
        crypPwd = hash;
      })*/
      const userData = {
        name: name,
        email: email,
        role: role,
        telephone: telephone,
        password: crypPwd,
        created_at: new Date().toISOString().slice(0,19).replace('T',' '),
        id_utilisateur : id,
      };
      if (!actionType && (!userData.name || !userData.email || !userData.password || !userData.telephone || !userData.role || !confirmPassword)) {
        setError('Veuillez remplir tous les champs');
        setTimeout(() => {
          setError("");
        },7000)
        return;
      }
      if (!actionType && (!bcrypt.compareSync(confirmPassword, userData.password))) {
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
      if (actionType) {
        const req_users = `UPDATE utilisateur SET nom_utilisateur = "${userData.name}",email_utilisateur = "${userData.email}",
        role_utilisateur = "${userData.role}",telephone_utilisateur = "${userData.telephone}",
        updated_at_utilisateur = "${userData.created_at}" 
        WHERE id_utilisateur = ${userData.id_utilisateur}`;
        //console.log(`req user : ${req_users}`);
        window.electronAPI.updateUser(req_users);
        await window.electronAPI.userUpdatedSuccess(() => {
          setSuccess(`Les informations de ${userData.name} on été mis à jour`);
          setTimeout(() => {
            setSuccess("");
          }, 3000);
          console.log(userData)
        })
        setName("");
        setEmail("");
        setTelephone("");
        setPassword("");
        setConfirmPassword("");
        await handleRefresh();
      } else {
        console.log(userData);
        const req_users = `INSERT INTO utilisateur (nom_utilisateur,email_utilisateur,role_utilisateur,telephone_utilisateur,mdp_utilisateur,created_at_utilisateur) 
        VALUES ("${userData.name}","${userData.email}","${userData.role}","${userData.telephone}","${userData.password}","${userData.created_at}") `;
        window.electronAPI.addUser(req_users);
        await window.electronAPI.userAddedSuccess(() => {
          setSuccess(`Utilisateur ${userData.name} enregistré avec succès`);
          setTimeout(() => {
            setSuccess("");
          }, 3000);
        })
        setName("");
        setEmail("");
        setTelephone("");
        setPassword("");
        setConfirmPassword("");
        await handleRefresh();
      }
    } catch (error) {
      console.error(`Error on save user : ${error.message}`);
    }
  }

  // useEffect for getting data
  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <>
      <RegisterHeader />
      {/* Page content */}
      <Container className="mt--9">
        {/* Tableaux des Utilisateurs */}
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col lg="6">
                    <Input
                      type="select"
                      className="form-control mt-2"
                      onChange={handleStatutFilter}
                      value={statutFilter}
                    >
                      <option value="">Tous les rôles</option>
                      <option value="administrateur">administrateur</option>
                      <option value="utilisateur">utilisateur</option>
                    </Input>
                  </Col>
                  <Col lg="6">
                    <Input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Rechercher par nom"
                      onChange={handleSearch}
                      value={search}
                    />
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
          <Col lg="12">
            <Card className="shadow">
              <CardHeader className="bg-white border-2 d-flex justify-content-center">
                <h3 className="mb-0 text-center">Listes des Utilisateurs</h3>
                <Button
                  size="sm"
                  className="ml-3"
                  onClick={() => handleRefresh()}
                >
                  Actualiser
                </Button>
              </CardHeader>
              <Row>
                <Col lg="12">
                  {deleteSuccess && 
                    <Alert className="text-center" color="success">
                      {deleteSuccess}
                    </Alert>
                  }
                </Col>
              </Row>
              <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                      <tr>
                          <th>Nom</th>
                          <th>Adress mail</th>
                          <th>Téléphone</th>
                          <th>Rôle</th>
                          <th>Actions</th>
                          {/*<th>Nombre de xxx gérées</th>*/}
                      </tr>
                  </thead>
                  <tbody>
                    {loadingSpinner && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                      {filterUsers.length > 0 ? !loadingSpinner && (filterUsers.slice(offset, offset + perPage).map((u, index) => (
                          <tr key={index}>
                              <td>{u.nom_utilisateur}</td>    
                              <td>{u.email_utilisateur}</td>
                              <td>{u.telephone_utilisateur}</td>
                              <td>{u.role_utilisateur}</td>
                              <td className="text-right">
                                  <UncontrolledDropdown>
                                      <DropdownToggle
                                      className="btn-icon-only text-light"
                                      role="button"
                                      size="sm"
                                      color=""
                                      onClick={(e) => e.preventDefault()}
                                      >
                                          <i className="fas fa-ellipsis-v" />
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown-menu-arrow" right>
                                          <DropdownItem
                                            onClick={() => editUser(u)}
                                          >
                                            Modifier l'utilisateur
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() => deleteUser(u)}
                                          >
                                            Supprimer l'utilisateur
                                          </DropdownItem>
                                          <DropdownItem
                                            onClick={() => updatePassword(u)}
                                          >
                                            Modifier le mot de passe
                                          </DropdownItem>
                                      </DropdownMenu>
                                  </UncontrolledDropdown>
                              </td>
                          </tr>
                      )))
                      :
                        !loadingSpinner && (
                          <tr>
                            <td colSpan="7" className="text-center">
                              {loadingText}
                            </td>
                          </tr>
                        )
                      }
                  </tbody>
              </Table>
              <Row className="m-0 justify-content-center">
                  <CardFooter className="py-3 d-flex" >
                      <nav className="ligna-items-center" aria-label="...">
                          <Pagination
                            className="pagination justify-content-center"
                            listClassName="justify-content-center"
                          >
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePagePrev()}
                                tabIndex="-1"
                              >
                                <i className="fas fa-angle-left" />
                                <span className="sr-only">Previous</span>
                              </PaginationLink>
                            </PaginationItem>
                              {Array.from({length: pageCount}, (_, i) => (
                                  <PaginationItem key={i} active={i === pageNumber}>
                                      <PaginationLink onClick={() => handlePageChange({selected: i})}>
                                          {i}
                                      </PaginationLink>
                                  </PaginationItem>
                              ))}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageNext()}
                              >
                                <i className="fas fa-angle-right" />
                                <span className="sr-only">Next</span>
                              </PaginationLink>
                            </PaginationItem>
                          </Pagination>
                      </nav>
                  </CardFooter>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="order-xl-1" lg="12" md="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col lg="12">
                    { message && (
                      <h3 className="mb-0 text-center">
                        {message}
                      </h3>
                      )
                    }
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
                                disabled={disable}
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
                                disabled={disable}
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
