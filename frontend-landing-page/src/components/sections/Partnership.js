import classNames from "classnames";
import React from "react";
import Image from "../elements/Image";
import SectionHeader from "./partials/SectionHeader";

export const Partnership = ({ className, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);

  const innerClasses = classNames(
    "features-tiles-inner section-inner has-top-divider"
  );

  const tilesClasses = classNames("tiles-wrap center-content");

  const sectionHeader = {
    title: "Socios",
    paragraph:
      "El consorcio que lleva a cabo el proyecto está formado por un total de siete entidades: dos clústers, un centro tecnológico, dos pymes y una startup de base tecnológica y una empresa agroalimentaria.",
  };

  const logosPath = [
    { path: "virtalis-logo.png", link: "https://www.vitartis.es/" },
    { path: "7edata-logo.png", link: "https://www.7edata.com/" },
    {
      path: "agrointelligent-logo.webp",
      link: "https://www.agrointelligent.com/",
    },
    { path: "geoslab-logo.png", link: "https://www.geoslab.com/" },
    { path: "campg-logo.png", link: "https://campag.es/" },
    { path: "pystacil-logo.png", link: "https://pistacyl.com/" },
    { path: "cetemet-logo.png", link: "https://cetemet.es/" },
  ];

  return (
    <section className={outerClasses} {...props}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            {logosPath.map(({ path, link }, i) => (
              <a
                className="tiles-item reveal-from-bottom"
                data-reveal-delay={`${i * 50}`}
                key={i}
                href={link}
              >
                <div className="tiles-item-inner">
                  <img
                    style={{ objectFit: "contain" }}
                    src={require(`../../assets/images/${path}`)}
                    width={200}
                    height={200}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
