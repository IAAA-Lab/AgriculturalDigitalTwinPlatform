import classNames from "classnames";
import React from "react";
import Image from "../elements/Image";
import SectionHeader from "./partials/SectionHeader";

export const Financing = ({ className, bottomDivider, ...props }) => {
  const outerClasses = classNames("features-tiles section", className);

  const innerClasses = classNames(
    "features-tiles-inner section-inner has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames("tiles-wrap center center-content");

  const sectionHeader = {
    title: "Financiación",
    paragraph:
      "El proyecto GEDEFEC está apoyado por la convocatoria de octubre de 2021, de apoyo a AAEEII del Ministerio de Industria, Comercio y Turismo, financiada por la Unión Europea – Next Generation EU (Nº Expte: AEI-010500-2021b-122).",
  };

  const logosPath = [
    { name: "AEI Clúster", src: "logo-AEI-cluster.jpg", width: 250 },
    { name: "NextGenerationEU", src: "NExtGen.jfif", width: 300 },
    {
      name: "Ministerio de Industria y Comercio",
      src: "Logo-Gobierno-MINCOTUR-DGIPYME.jpg",
      width: 400,
    },
    {
      name: "Plan de Recuperación, Transformación y Resiliencia",
      src: "logo-planrecuperacion.jpg",
      width: 300,
    },
  ];

  return (
    <section className={outerClasses} {...props}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            {logosPath.map((logo, i) => (
              <div
                className="reveal-from-bottom"
                data-reveal-delay={`${i * 50}`}
                key={i}
              >
                <Image
                  src={require(`../../assets/images/${logo.src}`)}
                  alt={logo.name}
                  width={logo.width}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
