import React from "react";
import classNames from "classnames";
import { SectionSplitProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Image from "../elements/Image";

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
    title: "Conociendo la tecnología",
    paragraph:
      "El concepto de gemelo digital en agricultura está muy poco consolidado debido, especialmente, a la gran complejidad de discretizar una realidad basada en “elementos” vivos (una planta o un animal o un conjunto de ellos…) y con unos ámbitos temporales (plantas con periodos de vida de un año frente a plantas con periodos de vida de cientos de años …) y espaciales (pequeña explotaciones frente a otras de mayor tamaño), tan heterogéneos y complejos.",
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
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Fase 1
                </div>
                <h3 className="mt-0 mb-12">Modelo e identificación de datos</h3>
                <p className="m-0">
                  Obtener un modelo de datos que sustente el desarrollo del
                  gemelo digital. Para ello, se identificarán y caracterizarán
                  las variables que son relevantes en los cultivos de frutos de
                  cáscara, así como la relación entre ellas.
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
                  src={require("./../../assets/images/fase_1_1.jpg")}
                  alt="Features split 01"
                  width={528}
                  className="bordered"
                  height={396}
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-right"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Fase 1
                </div>
                <h3 className="mt-0 mb-12">Funcionalidades</h3>
                <p className="m-0">
                  Especificar las funcionalidades que debe tener el gemelo
                  digital.
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
                  src={require("./../../assets/images/fase_1_2.jpg")}
                  alt="Features split 02"
                  width={528}
                  className="bordered"
                  height={396}
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Fase 1
                </div>
                <h3 className="mt-0 mb-12">
                  Primera implementación y demostrador
                </h3>
                <p className="m-0">
                  Disponer de una primera implementación del sistema de
                  información que constituye en gemelo digital. Además, contar
                  con un primer demostrador alimentado con datos de una
                  explotación real que pueda servir de base para el desarrollo
                  de las siguientes fases.
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
                  width={528}
                  className="bordered"
                  height={396}
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
