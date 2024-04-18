/* eslint-disable no-unused-vars */
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useAuth } from "services/AuthContext";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const { user } = useAuth();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    const excludesRoutes = ['/attestation-conge','/attestation-permission','/attestation_rep_permissions','/attestation_rep_conges','/personnel-details','/login','/register','/archive','/archive_permissions','/archive_att_rep_permissions','/archive_att_rep_conges']
    return routes.map((prop, key) => {
      if (!excludesRoutes.includes(prop.path)) {
        return (
          <NavItem key={key}>
            <NavLink
              to={{pathname: prop.layout + prop.path}}
              tag={NavLinkRRD}
              onClick={() => closeCollapse()}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      }
      return null;
    });
  };
  const createArchivesLinks = (routes) => {
    const includesRoutes = ['/archive','/archive_permissions','/archive_att_rep_permissions','/archive_att_rep_conges']
    return routes.map((prop, key) => {
      if (includesRoutes.includes(prop.path)) {
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      }
      return null;
    });
  };
  const createAttestationsLinks = (routes) => {
    const includesRoutes = ['/attestation-conge','/attestation-permission','/attestation_rep_permissions','/attestation_rep_conges']
    return routes.map((prop, key) => {
      if (includesRoutes.includes(prop.path)) {
        return (
          <NavItem key={key}>
            <NavLink
              to={{pathname : prop.layout + prop.path}}
              tag={NavLinkRRD}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      }
      return null;
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  // to logout function 
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            GESCON-APP
            {/*<img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
        />*/}
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center">
          <UncontrolledDropdown nav>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Bienvenue !</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Paramètres</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem tag={NavLinkRRD} onClick={handleLogout}>
                <i className="ni ni-user-run" />
                <span>Deconnexion</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Rechercher ..."
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading text-muted">Attestations</h6>
          {/* Archives Navigation */}
          <Nav navbar>{createAttestationsLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading text-muted">Archives</h6>
          {/* Archives Navigation */}
          <Nav navbar>{createArchivesLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading text-muted">Autres</h6>
          {/* Navigation */}
          <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink 
                to="/admin/conges"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="ni ni-spaceship text-dark" />
                Tutoriel
              </NavLink>
            </NavItem>
            { user.role_utilisateur === "administrateur" ? (
                <NavItem>
                  <NavLink 
                    to="/admin/register"
                    tag={NavLinkRRD}
                    onClick={closeCollapse}
                  >
                    <i className="ni ni-circle-08 text-dark" />
                    Ajouter des utilisateurs
                  </NavLink>
                </NavItem>
              ) : ""
            }
            <NavItem>
              <NavLink 
                to="/admin/user-profile"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="ni ni-ui-04 text-dark" />
                Paramètres
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag={NavLinkRRD}
                onClick={handleLogout}           
              >
                <i className="ni ni-spaceship text-dark" />
                Se Deconnecter
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
