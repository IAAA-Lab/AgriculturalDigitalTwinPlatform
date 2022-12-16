import classNames from "classnames";
import React from "react";
import SectionHeader from "./partials/SectionHeader";

export const Partnership = ({ className, partners, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);

  const innerClasses = classNames(
    "features-tiles-inner section-inner has-top-divider"
  );

  const tilesClasses = classNames("tiles-wrap center center-content");

  const sectionHeader = {
    title: "Socios",
    paragraph:
      "El consorcio que lleva a cabo el proyecto está formado por un total de siete entidades: dos clústers, un centro tecnológico, dos pymes y una startup de base tecnológica y una empresa agroalimentaria.",
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
