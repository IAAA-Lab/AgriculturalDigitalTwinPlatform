import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollReveal from "./utils/ScrollReveal";
import ReactGA from "react-ga";
import { AuthContextWrapper } from "./context/AuthContextProvider";
import { SwitchApp } from "./utils/SwitchApp";

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = (page) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {
  const childRef = useRef();
  let location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initScroll = () => {
    const page = location.pathname;
    document.body.classList.add("is-loaded");
    childRef.current.init();
    trackPage(page);
  };

  useEffect(() => {
    initScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <AuthContextWrapper>
          <SwitchApp initScroll={initScroll} />
        </AuthContextWrapper>
      )}
    />
  );
};

export default App;
