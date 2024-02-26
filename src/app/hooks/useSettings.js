import { useContext } from "react";
import { SettingsContext } from "app/contexts/SettingsContext.js";

const useSettings = () => useContext(SettingsContext);
export default useSettings;
