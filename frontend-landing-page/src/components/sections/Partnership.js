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
    "virtalis-logo.png",
    "7edata-logo.png",
    "agrointelligent-logo.webp",
    "campg-logo.png",
    "geoslab-logo.png",
    "pystacil-logo.png",
    "cetemet-logo.jpg",
  ];

  return (
    <section className={outerClasses} {...props}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            {logosPath.map((logo, i) => (
              <div
                className="tiles-item reveal-from-bottom"
                data-reveal-delay={`${i * 50}`}
                key={i}
              >
                <div className="tiles-item-inner">
                  <Image
                    src={require(`../../assets/images/${logo}`)}
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
