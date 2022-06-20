import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../../app/config/context/redux/app-store";
import { Header } from "./components/Header";
import { NotificationsLayer } from "./components/NotificationsLayer";
import { WeatherLayout } from "./components/WeatherLayout";

type Props = {
  children: React.ReactNode;
};

export const LayoutDefault = ({ children }: Props) => {
  useEffect(() => {
    document.body.classList.add("is-loaded");
  }, []);

  const toggleNotifications = useSelector(
    (state: RootState) => state.toggleNotifications
  );

  const toggleWeather = useSelector((state: RootState) => state.toggleWeather);

  const classes = classNames(
    "site-content",
    (toggleNotifications || toggleWeather) && "on-drawer-active"
  );

  return (
    <>
      <Header />
      <main className={classes}>{children}</main>
      {/* <Footer /> */}
      <WeatherLayout show={toggleWeather} />
      <NotificationsLayer show={toggleNotifications} />
    </>
  );
};
