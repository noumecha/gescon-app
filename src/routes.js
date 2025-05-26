import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Conges from "views/examples/Conges.js";
import Personnel from "views/examples/Personnel.js";
import Decision from "views/examples/Decision.js";
import Permission from "views/examples/Permission";
import AttestationConge from "views/examples/AttestationConge";
import AttestationPermission from "views/examples/AttestationPermission";
import ArchiveAttestationConge from "views/examples/ArchiveAttestationConge";
import ArchiveAttestationPermission from "views/examples/ArchiveAttestationPermission";
import PersonnelDetails from "views/examples/PersonnelDetails";
import StructureStats from "views/examples/StructureStats";
import AttestationRepPermission from "views/examples/AttestationRepPermission";
import AttestationRepConge from "views/examples/AttestationRepConge";
import ArchiveAttestationRepPermission from "views/examples/ArchiveAttestationRepPermission";
import ArchiveAttestationRepConge from "views/examples/ArchiveAttestationRepConge";
import FicheSuivie from "views/examples/FicheSuivie";
import FicheStatsGlobal from "views/examples/FicheStatsGlobal";

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
    path: "/permission",
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
    path: "/personnel-details",
    name: "Détails",
    icon: "ni ni-circle-08 text-blue",
    component: <PersonnelDetails />,
    layout: "/admin",
  },
  /*{
    path: "/fiches",
    name: "Fiches Personnel",
    icon: "ni ni-collection text-blue",
    component: <FichePersonnel />,
    layout: "/admin",
  },*/
  {
    path: "/attestation-conge",
    name: "Attestations congés",
    icon: "ni ni-paper-diploma text-blue",
    component: <AttestationConge />,
    layout: "/admin",
  },
  {
    path: "/attestation-permission",
    name: "Attestations permission",
    icon: "ni ni-paper-diploma text-blue",
    component: <AttestationPermission />,
    layout: "/admin",
  },
  {
    path: "/archive",
    name: "Congés Archivés",
    icon: "ni ni-archive-2 text-blue",
    component: <ArchiveAttestationConge />,
    layout: "/admin",
  },
  {
    path: "/archive_permissions",
    name: "Permisions Archivés",
    icon: "ni ni-archive-2 text-blue",
    component: <ArchiveAttestationPermission />,
    layout: "/admin",
  },
  {
    path: "/structures",
    name: "Structures",
    icon: "ni ni-building text-blue",
    component: <StructureStats />,
    layout: "/admin",
  },
   /*{
    path: "/tables",
    name: "Tables",
    icon: "ni ni-ruler-pencil text-blue",
    component: <Tables />,
    layout: "/admin",
  },
 {
    path: "/icons",
    name: "Structures",
    icon: "ni ni-ruler-pencil text-blue",
    component: <Icons />,
    layout: "/admin",
},*/
  {
    path: "/decision",
    name: "Decisions",
    icon: "ni ni-ruler-pencil text-blue",
    component: <Decision />,
    layout: "/admin",
  },
  {
    path: "/attestation_rep_permissions",
    name: "Attestations reprise permissions",
    icon: "ni ni-paper-diploma text-blue",
    component: <AttestationRepPermission />,
    layout: "/admin",
  },
  {
    path: "/archive_att_rep_permissions",
    name: "Attestation Reprise Permisions Archivées",
    icon: "ni ni-archive-2 text-blue",
    component: <ArchiveAttestationRepPermission />,
    layout: "/admin",
  },
  {
    path: "/attestation_rep_conges",
    name: "Attestations reprise congés",
    icon: "ni ni-paper-diploma text-blue",
    component: <AttestationRepConge />,
    layout: "/admin",
  },
  {
    path: "/archive_att_rep_conges",
    name: "Attestation Reprise Congés Archivées",
    icon: "ni ni-archive-2 text-blue",
    component: <ArchiveAttestationRepConge />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "ni ni-single-02 text-blue",
    component: <Profile name="ivan"/>,
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
  {
    path: "/fiches-de-suivies",
    name: "Fiches de suivies",
    icon: "ni ni-single-copy-04 text-blue",
    component: <FicheSuivie />,
    layout: "/admin"
  },
  {
    path: "/fiches-statistiques",
    name: "fiches statistiques",
    icon: "ni ni-single-copy-04 text-blue",
    component: <FicheStatsGlobal />,
    layout: "/admin"
  },
];
export default routes;
