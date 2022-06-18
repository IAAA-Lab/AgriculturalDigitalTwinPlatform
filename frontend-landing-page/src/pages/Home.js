import React from "react";
// import sections
import Hero from "../components/sections/Hero";
import FeaturesTiles from "../components/sections/FeaturesTiles";
import FeaturesSplit from "../components/sections/FeaturesSplit";
import { Financing } from "../components/sections/Financing";
import { Partnership } from "../components/sections/Partnership";
import Testimonial from "../components/sections/Testimonial";
import { ScrollToTop } from "../components/layout/partials/ScrollToTop";

const Home = () => {
  return (
    <>
      <Hero className="illustration-section-01" />
      <FeaturesTiles />
      <FeaturesSplit
        invertMobile
        topDivider
        imageFill
        className="illustration-section-02"
      />
      <Partnership />
      <Financing />
      <Testimonial topDivider />
      <ScrollToTop />
    </>
  );
};

export default Home;
