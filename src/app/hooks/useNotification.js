import { useContext } from "react";
import NotificationContext from "app/contexts/NotificationContext.js";

const useNotification = () => useContext(NotificationContext);
export default useNotification;
