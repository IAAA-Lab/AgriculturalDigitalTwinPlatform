import classNames from "classnames";
import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { PANEL_URL } from "../../../../../app/config/constants";
import { doLogout } from "../../../../../app/config/context/redux/app-actions";
import { useTypedDispatch } from "../../../../../app/config/context/redux/app-store";

const UserOptions = () => {
  const [active, setActive] = useState(false);
  const dispatch = useTypedDispatch();
  const className = classNames("nav-dropdown mt-8", active && "is-active");

  return (
    <OutsideClickHandler onOutsideClick={() => setActive(false)}>
      <div
        className="card-icon-main"
        style={{ paddingBottom: 0, fill: "black" }}
      >
        <svg
          onClick={() => setActive(!active)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="25"
          height="25"
        >
          <g id="_01_align_center" data-name="01 align center">
            <path d="M21,24H19V18.957A2.96,2.96,0,0,0,16.043,16H7.957A2.96,2.96,0,0,0,5,18.957V24H3V18.957A4.963,4.963,0,0,1,7.957,14h8.086A4.963,4.963,0,0,1,21,18.957Z" />
            <path d="M12,12a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,12ZM12,2a4,4,0,1,0,4,4A4,4,0,0,0,12,2Z" />
          </g>
        </svg>
      </div>
      <ul className={className} onClick={() => setActive(false)}>
        <li className="row" onClick={() => dispatch(doLogout())}>
          <img
            src={
              require("../../../../../app/assets/images/icons/logout-icon.svg")
                .default
            }
            className="mr-8"
            alt="logout"
          />
          Salir
        </li>
        <a href={PANEL_URL}>
          <li className="row">
            <img
              src={
                require("../../../../../app/assets/images/icons/config-icon.svg")
                  .default
              }
              className="mr-8"
              alt="config"
            />
            Panel
          </li>
        </a>
      </ul>
    </OutsideClickHandler>
  );
};

export default UserOptions;
