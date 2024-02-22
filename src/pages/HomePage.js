import React, { useState, useEffect } from 'react';
import { Route, Navigate } from "react-router-dom";
import { Routes } from "../routes.js";

// pages
import Presentation from "./Presentation.js";
import Upgrade from "./Upgrade.js";
import DashboardOverview from "./dashboard/DashboardOverview.js";
import Transactions from "./Transactions.js";
import Settings from "./Settings.js";
import BootstrapTables from "./tables/BootstrapTables.js";
import Signin from "./examples/Signin.js";
import Signup from "./examples/Signup.js";
import ForgotPassword from "./examples/ForgotPassword.js";
import ResetPassword from "./examples/ResetPassword.js";
import Lock from "./examples/Lock.js";
import NotFoundPage from "./examples/NotFound.js";
import ServerError from "./examples/ServerError.js";

// documentation pages
import DocsOverview from "./documentation/DocsOverview.js";
import DocsDownload from "./documentation/DocsDownload.js";
import DocsQuickStart from "./documentation/DocsQuickStart.js";
import DocsLicense from "./documentation/DocsLicense.js";
import DocsFolderStructure from "./documentation/DocsFolderStructure.js";
import DocsBuild from "./documentation/DocsBuild.js";
import DocsChangelog from "./documentation/DocsChangelog.js";

// components
import Sidebar from "../components/Sidebar.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Preloader from "../components/Preloader.js";

import Accordion from "./components/Accordion.js";
import Alerts from "./components/Alert.js";
import Badges from "./components/Badges.js";
import Breadcrumbs from "./components/Breadcrumbs.js";
import Buttons from "./components/Buttons.js";
import Forms from "./components/Forms.js";
import Modals from "./components/Modals.js";
import Navs from "./components/Navs.js";
import Navbars from "./components/Navbars.js";
import Pagination from "./components/Pagination.js";
import Popovers from "./components/Popovers.js";
import Progress from "./components/Progress.js";
import Tables from "./components/Tables.js";
import Tabs from "./components/Tabs.js";
import Tooltips from "./components/Tooltips.js";
import Toasts from "./components/Toasts.js";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <Route>
    <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} />
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} />
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />

    {/* components */}
    <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} />
    <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
    <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
    <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} />
    <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
    <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
    <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
    <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
    <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
    <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} />
    <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
    <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
    <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
    <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
    <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
    <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

    {/* documentation */}
    <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} />
    <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} />
    <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} />
    <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} />
    <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} />
    <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} />
    <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} />

    <Navigate to={Routes.NotFound.path} />
  </Route>
);
