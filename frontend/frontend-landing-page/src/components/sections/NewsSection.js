import React from "react";
import classNames from "classnames";
import { PaginatedItems } from "../elements/Pagination";

export const NewsSection = ({ className, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);
  const innerClasses = classNames("features-tiles-inner section-inner pt-0");

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <h3 className="reveal-from-bottom mt-0">Noticias relacionadas</h3>
          <div className="reveal-from-bottom pagination" data-reveal-delay="50">
            <PaginatedItems itemsPerPage={6} />
          </div>
        </div>
      </div>
    </section>
  );
};
