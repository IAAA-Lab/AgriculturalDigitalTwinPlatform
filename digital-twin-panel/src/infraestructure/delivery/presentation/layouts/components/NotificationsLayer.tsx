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
          <h3>Fire!</h3>
          <p>Hay fuegooooo</p>
        </div>
      </div>
    </div>
  );
};
