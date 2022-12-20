import React from "react";
import classNames from "classnames";
import { PaginatedItems } from "../elements/Pagination";

export const NewsSection = ({ className, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);
  const innerClasses = classNames("features-tiles-inner section-inner pt-0");

  return (
    <section {...props} className={outerClasses}>
      <div className="container" style={{ padding: "1rem" }}>
        <div className={innerClasses}>
          <h3 className="reveal-from-bottom">Noticias relacionadas</h3>
          <div
            className="reveal-from-bottom pagination pt-32"
            data-reveal-delay="50"
          >
            <PaginatedItems itemsPerPage={6} />
          </div>
        </div>
      </div>
    </section>
  );
};
