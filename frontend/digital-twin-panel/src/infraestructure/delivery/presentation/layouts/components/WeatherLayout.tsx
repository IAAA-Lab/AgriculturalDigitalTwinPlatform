import classNames from "classnames";
import { doToggleWeather } from "../../../../../app/config/context/redux/app-actions";
import { useTypedDispatch } from "../../../../../app/config/context/redux/app-store";

type Props = {
  show: boolean;
};

export const WeatherLayout = ({ show = false }: Props) => {
  const classes = classNames("weather-wrapper", show && "off-is-active");
  const dispatch = useTypedDispatch();

  return (
    <div className={classes} onClick={() => dispatch(doToggleWeather())}>
      <div className="weather-inner">
        <div className="notifications-card">
          <h3>Fire!</h3>
          <p>Hay fuegooooo</p>
        </div>
      </div>
    </div>
  );
};
