import { useContext } from "react";
import AuthContext from "app/contexts/JWTAuthContext.js";

const useAuth = () => useContext(AuthContext);
export default useAuth;
