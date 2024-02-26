import { lazy } from "react";
import Loadable from "app/components/Loadable.jsx";

const AppForm = Loadable(lazy(() => import("./forms/AppForm.jsx")));
const AppMenu = Loadable(lazy(() => import("./menu/AppMenu.jsx")));
const AppIcon = Loadable(lazy(() => import("./icons/AppIcon.jsx")));
const AppProgress = Loadable(lazy(() => import("./AppProgress.jsx")));
const AppRadio = Loadable(lazy(() => import("./radio/AppRadio.jsx")));
const AppTable = Loadable(lazy(() => import("./tables/AppTable.jsx")));
const AppSwitch = Loadable(lazy(() => import("./switch/AppSwitch.jsx")));
const AppSlider = Loadable(lazy(() => import("./slider/AppSlider.jsx")));
const AppDialog = Loadable(lazy(() => import("./dialog/AppDialog.jsx")));
const AppButton = Loadable(lazy(() => import("./buttons/AppButton.jsx")));
const AppCheckbox = Loadable(lazy(() => import("./checkbox/AppCheckbox.jsx")));
const AppSnackbar = Loadable(lazy(() => import("./snackbar/AppSnackbar.jsx")));
const AppAutoComplete = Loadable(lazy(() => import("./auto-complete/AppAutoComplete.jsx")));
const AppExpansionPanel = Loadable(lazy(() => import("./expansion-panel/AppExpansionPanel.jsx")));

const materialRoutes = [
  { path: "/material/table", element: <AppTable /> },
  { path: "/material/form", element: <AppForm /> },
  { path: "/material/buttons", element: <AppButton /> },
  { path: "/material/icons", element: <AppIcon /> },
  { path: "/material/progress", element: <AppProgress /> },
  { path: "/material/menu", element: <AppMenu /> },
  { path: "/material/checkbox", element: <AppCheckbox /> },
  { path: "/material/switch", element: <AppSwitch /> },
  { path: "/material/radio", element: <AppRadio /> },
  { path: "/material/slider", element: <AppSlider /> },
  { path: "/material/autocomplete", element: <AppAutoComplete /> },
  { path: "/material/expansion-panel", element: <AppExpansionPanel /> },
  { path: "/material/dialog", element: <AppDialog /> },
  { path: "/material/snackbar", element: <AppSnackbar /> }
];

export default materialRoutes;
