import React, { useContext } from "react";
import { useJwt } from "react-jwt";
import AuthContext from "../context/contexts";
import AppRoute from "./AppRoute";

export const PrivateRoute = ({ component, layout, ...rest }) => {
  const auth = useContext(AuthContext);

  const { isExpired } = useJwt(localStorage.getItem("jwtToken"));

  if (!isExpired) {
    return <AppRoute component={component} layout={layout} {...rest} />;
  }
  auth.actions.logout();
};
