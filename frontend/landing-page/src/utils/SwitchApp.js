import React, { useContext, useEffect } from "react";
import { Switch } from "react-router-dom";
import AuthContext from "../context/contexts";
import getRoutes from "./routes";
import AppRoute from "./AppRoute";
import { Page404 } from "../pages/404";
import { PrivateRoute } from "./PrivateAppRoute";

export const SwitchApp = ({ initScroll }) => {
  const user = useContext(AuthContext).usr;

  useEffect(() => {
    // For replaying the scroll animation
    initScroll();
  }, [initScroll, user]);

  return (
    <Switch>
      {getRoutes(user).map((props) =>
        props.protected ? (
          <PrivateRoute {...props} key={props.path} />
        ) : (
          props.path && <AppRoute {...props} key={props.path} />
        )
      )}
      <AppRoute path="*" component={Page404} />
    </Switch>
  );
};
