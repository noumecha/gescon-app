import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
//import Tables from "views/examples/Tables.js";
import Conges from "views/examples/Conges.js";
import Personnel from "views/examples/Personnel.js";
import Decision from "views/examples/Decision.js";
//import Icons from "views/examples/Icons.js";
import Permission from "views/examples/Permission";
import Attestation from "views/examples/Attestation";
import FichePersonnel from "views/examples/FichePersonnel";
import ArchiveAttestation from "views/examples/ArchiveAttestation";
import PersonnelDetails from "views/examples/PersonnelDetails";

var routes = [
  {
    path: "/index",
    name: "Accueil",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/conges",
    name: "Congés",
    icon: "ni ni-calendar-grid-58 text-blue",
    component: <Conges />,
    layout: "/admin",
  },
  {
    path: "/Permission",
    name: "Permissions",
    icon: "ni ni-single-copy-04 text-blue",
    component: <Permission />,
    layout: "/admin",
  },
  {
    path: "/personnel",
    name: "Personnel",
    icon: "ni ni-single-02 text-blue",
    component: <Personnel />,
    layout: "/admin",
  },
  {
    path: "/admin/personnel-details/:id",
    name: "Détails",
    icon: "ni ni-circle-08 text-blue",
    component: <PersonnelDetails />,
    layout: "/admin",
  },
  {
    path: "/fiches",
    name: "Fiches Personnel",
    icon: "ni ni-collection text-blue",
    component: <FichePersonnel />,
    layout: "/admin",
  },
  {
    path: "/attestation",
    name: "Attestations",
    icon: "ni ni-paper-diploma text-blue",
    component: <Attestation />,
    layout: "/admin",
  },
  {
    path: "/archive",
    name: "Attestations Archivés",
    icon: "ni ni-archive-2 text-blue",
    component: <ArchiveAttestation />,
    layout: "/admin",
  },
  {
    path: "/decision",
    name: "Decisions",
    icon: "ni ni-ruler-pencil text-blue",
    component: <Decision />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "ni ni-single-02 text-blue",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Se Connecter",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Ajouter des utilisateurs",
    icon: "ni ni-circle-08 text-blue",
    component: <Register />,
    layout: "/admin",
  },
];
export default routes;
