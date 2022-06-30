import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Image from "../../elements/Image";

const Logo = ({ className, light = false, ...props }) => {
  const classes = classNames("brand", className);

  return (
    <Link to="/">
      <div {...props} className={classes}>
        <Image
          src={require(light
            ? "./../../../assets/images/logo-light.svg"
            : "./../../../assets/images/logo.svg")}
          alt="Open"
          width={75}
          height={75}
        />
        <h5>GEDEFEC</h5>
      </div>
    </Link>
  );
};

export default Logo;
