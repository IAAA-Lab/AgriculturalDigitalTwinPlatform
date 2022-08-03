import classNames from "classnames";
import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { doLogout } from "../../../../../app/config/context/redux/app-actions";
import { useTypedDispatch } from "../../../../../app/config/context/redux/app-store";

const UserOptions = () => {
  const [active, setActive] = useState(false);
  const dispatch = useTypedDispatch();
  const className = classNames("nav-dropdown", active && "is-active");

  return (
    <OutsideClickHandler onOutsideClick={() => setActive(false)}>
      <img
        src={
          require("../../../../../app/assets/images/icons/avatar-icon.svg")
            .default
        }
        alt="avatar"
        onClick={() => setActive(!active)}
      />
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
        <li className="row">
          <img
            src={
              require("../../../../../app/assets/images/icons/config-icon.svg")
                .default
            }
            className="mr-8"
            alt="config"
          />
          Configuración
        </li>
      </ul>
    </OutsideClickHandler>
  );
};

export default UserOptions;
