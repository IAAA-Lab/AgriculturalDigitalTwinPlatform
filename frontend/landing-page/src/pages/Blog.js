import React from "react";

import { NewsSection } from "../components/sections/NewsSection";
import TwitterSection from "../components/sections/TwitterSection";

export const Blog = () => {
  return (
    <div className="illustration-section-01">
      <div className="blog container-xl">
        <div className="left">
          <TwitterSection />
        </div>
        <div className="right">
          <NewsSection />
        </div>
      </div>
    </div>
  );
};
