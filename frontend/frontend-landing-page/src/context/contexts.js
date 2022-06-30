import { createContext } from "react";

const AuthContext = createContext({ role: "default", logged: false });

export default AuthContext;
export const DEFAULT_USER = { role: "default", logged: false };
