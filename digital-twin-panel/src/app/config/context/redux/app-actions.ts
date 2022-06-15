import { AnyAction } from "redux";
import { RootState, store } from "./app-store";
import { ThunkAction } from "redux-thunk";
import { TOGGLE_NOTIFICATIONS, TOGGLE_WEATHER } from "./types.d";

const doToggleNotifications =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch({
      type: TOGGLE_NOTIFICATIONS,
      payload: !store.getState().toggleNotifications,
    });
  };

const doToggleWeather =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch({
      type: TOGGLE_WEATHER,
      payload: !store.getState().toggleWeather,
    });
  };

export { doToggleNotifications, doToggleWeather };
