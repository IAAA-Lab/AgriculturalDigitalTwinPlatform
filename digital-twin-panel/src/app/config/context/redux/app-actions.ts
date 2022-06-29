import { AnyAction } from "redux";
import { RootState, store } from "./app-store";
import { ThunkAction } from "redux-thunk";
import { authUseCases } from "../../configuration";
import { DEFAULT_AUTH } from "../../constants";
import { Auth, Result } from "../../../../core/Domain";
import {
  TOGGLE_NOTIFICATIONS,
  TOGGLE_WEATHER,
  LOGOUT,
  REFRESH_LOGIN,
} from "./types";

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

const doLogout =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    await authUseCases.logout();
    dispatch({
      type: LOGOUT,
      payload: DEFAULT_AUTH,
    });
  };

const doRefreshLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const auth = await authUseCases.refresh();
    dispatch({
      type: REFRESH_LOGIN,
      payload: auth,
    });
  };

const doValidateLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const auth = authUseCases.getAuth();
    if (auth.isError) {
      dispatch(doRefreshLogin());
      return;
    }
    const validated = authUseCases.validateLogin();
    if (!validated) {
      dispatch(doRefreshLogin());
      return;
    }
    dispatch({
      type: REFRESH_LOGIN,
      payload: auth,
    });
  };
export {
  doToggleNotifications,
  doToggleWeather,
  doRefreshLogin,
  doLogout,
  doValidateLogin,
};
