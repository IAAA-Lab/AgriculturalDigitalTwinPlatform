import React from "react";
import classNames from "classnames";
import { SectionSplitProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Image from "../elements/Image";
import Badge from "../elements/Badge";

const propTypes = {
  ...SectionSplitProps.types,
};

const defaultProps = {
  ...SectionSplitProps.defaults,
};

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {
  const outerClasses = classNames(
    "features-split section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "features-split-inner section-inner",
    bottomDivider && "has-bottom-divider"
  );

  const splitClasses = classNames(
    "split-wrap",
    invertMobile && "invert-mobile",
    invertDesktop && "invert-desktop",
    alignTop && "align-top"
  );

  const sectionHeader = {
    title: "Fases del proyecto",
    paragraph:
      "Trataremos de tres fases principales para el desarrollo del gemelo digital.",
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>
            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xs text-color-primary tt-u mb-8">
                  <strong>Fase 1 · </strong> AEI-010500-2021b-122
                </div>
                <h3 className="mt-0 mb-12">Modelo e identificación de datos</h3>
                <p className="m-0">
                  Elaboración del diseño de un modelo de datos que sustente el
                  desarrollo del gemelo digital y en especificar las funciones
                  que este gemelo debería ser capaz de aportar para ser útil al
                  sector
                </p>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-left",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src={require("./../../assets/images/fase_1_1.jpg")}
                  alt="Features split 01"
                  className="has-shadow"
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className={classNames(
                  "split-item-content center-content-mobile reveal-from-right",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <div className="text-xs text-color-primary tt-u mb-8">
                  <strong>Fase 2 · </strong> AEI-010500-2022b-61
                </div>
                <h3 className="mt-0 mb-12">Automatización y realimentación</h3>
                <p className="m-0">
                  Estudio de cuáles son las relaciones que se establecen en la
                  operativa de una parcela en una campaña con respecto a las
                  siguientes. De este modo, se pretende consolidar y
                  sistematizar el conocimiento popular que determina que lo que
                  le hagas a una parcela hoy va a influir en sus rendimientos a
                  medio y largo plazo.
                </p>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-left",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <img
                  src={require("./../../assets/images/fase_1_2.webp")}
                  alt="Features split 02"
                  className="has-shadow"
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xs text-color-primary tt-u mb-8">
                  <strong>Fase 3</strong>
                </div>
                <h3 className="mt-0 mb-12">Red de gemelos</h3>
                <p className="m-0">
                  Ánálisis de las relaciones entre las diversas parcelas
                  colindantes con vistas a determinar cómo impactan sobre la
                  explotación que sea objeto de estudio. Posteriormente se
                  llevará a cabo la introducción de sistemas de inteligencia
                  artificial que serán capaces de hacer los pronósticos de
                  comportamiento de la explotación.
                </p>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-bottom",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src={require("./../../assets/images/fase_1_3.jpg")}
                  alt="Features split 03"
                  className="has-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
