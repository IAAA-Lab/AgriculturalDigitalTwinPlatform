import React from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import Image from "../elements/Image";

const propTypes = {
  ...SectionProps.types,
};

const defaultProps = {
  ...SectionProps.defaults,
};

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {
  const outerClasses = classNames(
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "hero-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1
              className="mt-0 mb-16 reveal-from-bottom"
              data-reveal-delay="50"
            >
              <span className="text-color-primary">GE</span>melo{" "}
              <span className="text-color-primary">D</span>igital para{" "}
              <span className="text-color-primary">E</span>xplotaciones de{" "}
              <span className="text-color-primary">F</span>rutos s
              <span className="text-color-primary">E</span>cos de{" "}
              <span className="text-color-primary">C</span>áscara{" "}
              <span className="text-color-primary">GEDEFEC</span>
            </h1>
            <div className="container-xs">
              <p
                className="m-0 mb-32 reveal-from-bottom"
                data-reveal-delay="100"
              >
                El objetivo del proyecto es desarrollar una propuesta de gemelo
                digital para un tipo concreto de explotación agraria: frutos
                secos de cáscara.
              </p>
            </div>
          </div>
          <div
            className="hero-figure reveal-from-bottom illustration-element-01"
            data-reveal-value="20px"
            data-reveal-delay="200"
          >
            <img
              loading="lazy"
              className="has-shadow maintain-ratio"
              src={require("./../../assets/images/hero-image-initial.jpg")}
              alt="Hero"
            />
          </div>
          <p className="mt-32 fw-700">
            Los gemelos digitales permiten la digitalización de la realidad
            física como elemento de base para poder aplicar técnicas de
            inteligencia artificial a grandes volúmenes de datos.
          </p>
          <p>
            El concepto de gemelo digital en agricultura está muy poco
            consolidado debido, especialmente, a la gran complejidad de
            discretizar una realidad basada en “elementos” vivos (una planta o
            un animal o un conjunto de ellos…) y con unos ámbitos temporales
            (plantas con periodos de vida de un año frente a plantas con
            periodos de vida de cientos de años …) y espaciales (pequeña
            explotaciones frente a otras de mayor tamaño), tan heterogéneos y
            complejos.
          </p>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
