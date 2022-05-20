import classNames from "classnames";
import React from "react";
import Image from "../elements/Image";
import SectionHeader from "./partials/SectionHeader";

export const Financing = ({ className, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);

  const innerClasses = classNames(
    "features-tiles-inner section-inner has-top-divider"
  );

  const tilesClasses = classNames("tiles-wrap center-content");

  const sectionHeader = {
    title: "Financiación",
    paragraph:
      "El proyecto GEDEFEC está apoyado por la convocatoria de octubre de 2021, de apoyo a AAEEII del Ministerio de Industria, Comercio y Turismo, financiada por la Unión Europea – Next Generation EU (Nº Expte: AEI-010500-2021b-122).",
  };

  const logosPath = [
    { name: "AEI Clúster", src: "logo-AEI-cluster.jpg" },
    {
      name: "Ministerio de Industria y Comercio",
      src: "Logo-Gobierno-MINCOTUR-DGIPYME.jpg",
    },
    {
      name: "Plan de Recuperación, Transformación y Resiliencia",
      src: "logo-planrecuperacion.jpg",
    },
    { name: "NextGenerationEU", src: "NExtGen.jfif" },
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
                    src={require(`../../assets/images/${logo.src}`)}
                    alt={logo.name}
                    width="100%"
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
