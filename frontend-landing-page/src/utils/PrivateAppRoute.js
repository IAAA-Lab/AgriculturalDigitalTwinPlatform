import React, { useContext } from "react";
import { useJwt } from "react-jwt";
import { Redirect } from "react-router-dom";
import { authService } from "../api/auth";
import AuthContext from "../context/contexts";
import AppRoute from "./AppRoute";

export const PrivateRoute = ({ component, layout, ...rest }) => {
  const auth = useContext(AuthContext);

  const { isExpired } = useJwt(localStorage.getItem("jwtToken"));

  if (!isExpired) {
    return <AppRoute component={component} layout={layout} {...rest} />;
  }
  authService.refreshLogin().then((token) => {
    if (token) {
      auth.actions.refreshLogin(token);
    } else {
      auth.actions.logout();
    }
  });

  return auth.logged ? (
    <AppRoute component={component} layout={layout} {...rest} />
  ) : (
    <Redirect to="/" />
  );
};
