import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard.jsx";
import { authRoles } from "./auth/authRoles.js";

import Loadable from "./components/Loadable.jsx";
import MatxLayout from "./components/MatxLayout/MatxLayout.jsx";

import materialRoutes from "app/views/material-kit/MaterialRoutes.js";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound.jsx")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin.jsx")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister.jsx")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword.jsx")));
// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart.jsx")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics.jsx")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="dashboard/default" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
