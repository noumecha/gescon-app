import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
//import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Accueil",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Congés",
    icon: "ni ni-calendar-grid-58 text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Permissions",
    icon: "ni ni-single-copy-04 text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Personnel",
    icon: "ni ni-single-02 text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Fiches Personnel",
    icon: "ni ni-collection text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Attestations",
    icon: "ni ni-paper-diploma text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Attestations Archivés",
    icon: "ni ni-archive-2 text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Decisions",
    icon: "ni ni-ruler-pencil text-blue",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "ni ni-single-02 text-blue",
    component: <Profile />,
    layout: "/admin",
  },
  /*{
    path: "/login",
    name: "Se Connecter",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },*/
  {
    path: "/register",
    name: "Ajouter des utilisateurs",
    icon: "ni ni-circle-08 text-blue",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
