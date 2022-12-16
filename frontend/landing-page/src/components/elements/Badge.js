import React from "react";
import classNames from "classnames";

const Badge = ({ children, className, ...props }) => (
  <span className={classNames("badge", className)} {...props}>
    {children}
  </span>
);

export default Badge;
