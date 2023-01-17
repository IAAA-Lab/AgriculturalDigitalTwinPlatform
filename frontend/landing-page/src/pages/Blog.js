import React from "react";

import { NewsSection } from "../components/sections/NewsSection";
import TwitterSection from "../components/sections/TwitterSection";

export const Blog = () => {
  return (
    <div className="illustration-section-01">
      <div className="blog container-xl">
        <div className="left">
          <h1>Noticias</h1>
          <p>
            Donde se comenta la actualidad del proyecto. Prueba a hacer{" "}
            <strong>hacer click</strong> sobre algún tweet para visualizarlo
            mejor.
          </p>
        </div>
        <div className="right">
          <TwitterSection />
        </div>
        {/* <div className="right">
          <NewsSection />
        </div> */}
      </div>
    </div>
  );
};
