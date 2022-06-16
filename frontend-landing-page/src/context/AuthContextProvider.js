import React, { useEffect, useState } from "react";
import { decodeToken, isExpired } from "react-jwt";
import { authService } from "../api/auth";

import AuthContext, { DEFAULT_USER } from "./contexts";

export const AuthContextWrapper = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  const [usr, setUsr] = useState(DEFAULT_USER);

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      const logged = isExpired(token);
      if (logged) {
        setUsr({
          role: decodedToken === null ? DEFAULT_USER.role : decodedToken.role,
          logged: true,
        });
        return;
      }
      authService.refreshLogin().then((newToken) => {
        if (newToken) {
          const decodedNewToken = decodeToken(newToken);
          setUsr({ role: decodedNewToken.role, logged: true });
        } else {
          setUsr(DEFAULT_USER);
        }
      });
    }
  }, [token]);

  const actions = {
    login: (newUsr, newToken) => {
      localStorage.setItem("jwtToken", newToken);
      setUsr(newUsr);
    },
    refreshLogin: (newToken) => {
      localStorage.setItem("jwtToken", newToken);
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
