import React from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import { TwitterTweetEmbed } from "react-twitter-embed";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};

const Testimonial = ({
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
    "testimonial section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "testimonial-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames("tiles-wrap", pushLeft && "push-left");

  const sectionHeader = {
    title: "Conócenos",
    paragraph:
      "El grupo IAAA Lab está detrás del proyecto GEDEFEC con el objetivo de ayudar a la digitalización del sector agropecuario.",
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <div
              className="tiles-item reveal-from-right"
              data-reveal-delay="200"
            >
              <div className="tiles-item-inner">
                <TwitterTweetEmbed tweetId="1536101242832822272" />
                <div className="testimonial-item-footer text-xs mt-16 mb-0 has-top-divider" />
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <TwitterTweetEmbed tweetId={"1529155977748135937"} />
                <div className="testimonial-item-footer text-xs mt-16 mb-0 has-top-divider" />
              </div>
            </div>

            <div
              className="tiles-item reveal-from-left"
              data-reveal-delay="200"
            >
              <div className="tiles-item-inner">
                <TwitterTweetEmbed tweetId={"1508717443082035203"} />
                <div className="testimonial-item-footer text-xs mt-16 mb-0 has-top-divider" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
