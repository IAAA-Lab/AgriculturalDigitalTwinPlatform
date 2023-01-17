import classNames from "classnames";
import React from "react";
import SectionHeader from "./partials/SectionHeader";

export const Partnership = ({ className, partners, phase, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);

  const innerClasses = classNames(
    "features-tiles-inner section-inner has-top-divider"
  );

  const tilesClasses = classNames("tiles-wrap center center-content");

  const sectionHeader = {
    title: "Socios",
    paragraph: `El consorcio que lleva a cabo la ${phase} del proyecto está formado por las siguientes entidades.`,
  };

  return (
    <section className={outerClasses} {...props}>
      <div
        className="container reveal-from-bottom"
        data-reveal-delay="150"
        data-reveal-offset="250"
      >
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            {partners.map(({ path, link }, i) => (
              <a
                className="tiles-item"
                style={{ border: "none" }}
                key={i}
                href={link}
                rel="noreferrer"
                target="_blank"
              >
                <img
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                  src={require(`../../assets/images/${path}`)}
                  width={200}
                  height={175}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
