import React from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Image from "../elements/Image";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};
const FeaturesTiles = ({
  objectives,
  illustration,
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  const outerClasses = classNames(
    "features-tiles section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "features-tiles-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames(
    "tiles-wrap center center-content",
    pushLeft && "push-left"
  );

  const sectionHeader = {
    title: "Objetivos",
    paragraph:
      "Los objetivos de la fase son los que se muestran a continuación.",
  };

  return (
    <section {...props} className={outerClasses}>
      <div
        className="container reveal-from-bottom"
        data-reveal-delay="150"
        data-reveal-offset="200"
      >
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <br />
          <div className={tilesClasses}>
            {objectives.map((item) => (
              <div className="tiles-item">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Image
                        src={require(`./../../assets/images/${illustration}`)}
                        alt="Features tile icon 01"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h5 className="mt-0 mb-8">{item.title}</h5>
                    <p className="m-0 text-xs">{item.paragraph}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;
