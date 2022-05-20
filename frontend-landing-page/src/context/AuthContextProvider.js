import React, { useState } from "react";
import { decodeToken, isExpired } from "react-jwt";

import AuthContext, { DEFAULT_USER } from "./contexts";

export const AuthContextWrapper = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  const decodedToken = decodeToken(token);
  const [usr, setUsr] = useState(
    token
      ? {
          role: decodedToken === null ? DEFAULT_USER.role : decodedToken.role,
          logged: isExpired(token) ? false : true,
        }
      : DEFAULT_USER
  );
  const actions = {
    login: (newUsr, newToken) => {
      localStorage.setItem("jwtToken", newToken);
      setUsr(newUsr);
    },
    logout: () => {
      localStorage.removeItem("jwtToken");
      setUsr(DEFAULT_USER);
      window.location.href = "/";
    },
  };

  return (
    <AuthContext.Provider value={{ usr, actions }}>
      {children}
    </AuthContext.Provider>
  );
};
