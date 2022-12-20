import React from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Input from "../elements/Input";
import Image from "../elements/Image";

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

  const sectionHeader = {
    title: "Contacta con nosotros",
    paragraph:
      "El grupo IAAA Lab está detrás del proyecto GEDEFEC con el objetivo de ayudar a la digitalización del sector agropecuario.",
  };

  return (
    <section {...props} className={outerClasses} id="contact">
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div
            className="contact-card has-shadow reveal-from-bottom"
            data-reveal-delay="50"
          >
            <div className="contact-card-info">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Information-icon.svg/2048px-Information-icon.svg.png"
                alt="Información"
                width={50}
                height={50}
              />
              <h4 className="m-0 mb-8 mt-16">Información</h4>
              <p className="text-xs m-0">gedefec@unizar.es</p>
            </div>
            <div className="contact-card-mail">
              <h4>Envíanos un mensaje</h4>
              <form className="form-group">
                <div className="contact-card-mail-name">
                  <Input size="sm" type="email" placeholder="Nombre" />
                  <Input size="sm" placeholder="Apellidos" />
                </div>
                <Input size="sm" placeholder="Email" />
                <Input type="textarea" placeholder="Mensaje..." />
                <button
                  type="submit"
                  style={{ maxWidth: 250 }}
                  className="button button-sm button-wide-mobile button-primary mt-16"
                >
                  Enviar
                </button>
              </form>
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
