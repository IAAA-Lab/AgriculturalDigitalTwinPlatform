import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../../app/config/context/redux/app-store";
import ScrollReveal from "../components/ScrollReveal";
import { Header } from "./components/Header";
import { NotificationsLayer } from "./components/NotificationsLayer";
import { WeatherLayout } from "./components/WeatherLayout";

type Props = {
  children: React.ReactNode;
};

export const LayoutDefault = ({ children }: Props) => {
  const childRef = useRef<any>();
  let location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initScroll = () => {
    document.body.classList.add("is-loaded");
    childRef.current.init();
  };

  useEffect(() => {
    initScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const toggleNotifications = useSelector(
    (state: RootState) => state.toggleNotifications
  );

  const toggleWeather = useSelector((state: RootState) => state.toggleWeather);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <>
          <Header />
          <main className="site-content">{children}</main>
          {/* <Footer /> */}
          <NotificationsLayer show={toggleNotifications} />
          <WeatherLayout show={toggleWeather} />
        </>
      )}
    />
  );
};
