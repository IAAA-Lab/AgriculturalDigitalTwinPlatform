import classNames from "classnames";
import { doToggleNotifications } from "../../../../../app/config/context/redux/app-actions";
import { useTypedDispatch } from "../../../../../app/config/context/redux/app-store";

type Props = {
  show: boolean;
};

export const NotificationsLayer = ({ show = false }: Props) => {
  const classes = classNames("notifications-wrapper", show && "off-is-active");
  const dispatch = useTypedDispatch();

  return (
    <div className={classes} onClick={() => dispatch(doToggleNotifications())}>
      <div className="notifications-inner">
        <div className="notifications-card">
          <h4 className="m-0">Temperatura inusualmente alta</h4>
          <p className="text-xs mb-8">
            La temperatura en el recinto 2 de la parcela 23 tiene una
            temperatura de 30°C. Pulse para acceder a la información del
            recinto.
          </p>
        </div>
      </div>
    </div>
  );
};
