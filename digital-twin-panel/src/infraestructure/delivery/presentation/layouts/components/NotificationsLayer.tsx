import classNames from "classnames";
import React from "react";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export const NotificationsLayer = ({ show = false, setShow }: Props) => {
  const classes = classNames("notifications-wrapper", show && "off-is-active");

  return (
    <div className={classes} onClick={() => setShow(false)}>
      <div className="notifications-inner">
        <div className="notifications-card">
          <h3>Fire!</h3>
          <p>Hay fuegooooo</p>
        </div>
      </div>
    </div>
  );
};
