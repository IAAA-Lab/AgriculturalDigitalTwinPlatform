import React from "react";
// import sections
import Hero from "../components/sections/Hero";
import FeaturesSplit from "../components/sections/FeaturesSplit";
import { Financing } from "../components/sections/Financing";
import Testimonial from "../components/sections/Contact";
import { ScrollToTop } from "../components/layout/partials/ScrollToTop";
import { PhasesContextWrapper } from "../context/PhasesContextProvider";
import Phases from "../components/sections/Phases";

const Home = () => {
  return (
    <>
      <Hero className="illustration-section-01" bottomDivider />
      <FeaturesSplit
        invertMobile
        bottomDivider
        imageFill
        className="illustration-section-02"
      />
      <PhasesContextWrapper>
        <Phases />
      </PhasesContextWrapper>
      <Testimonial />
      <ScrollToTop />
    </>
  );
};

export default Home;
