import { AnyAction } from "redux";
import { RootState, store } from "./app-store";
import { ThunkAction } from "redux-thunk";
import {
  TOGGLE_NOTIFICATIONS,
  TOGGLE_WEATHER,
  LOGOUT,
  REFRESH_LOGIN,
  LOGIN,
} from "./types";
import { MustLoginAgainError } from "../../../../core/Exceptions";

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
    //await authUseCases.logout();
    dispatch({
      type: LOGOUT,
      payload: {
        isError: true,
        error: MustLoginAgainError,
      },
    });
  };

const doRefreshLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    // const auth = await authUseCases.refresh();
    // dispatch({
    //   type: REFRESH_LOGIN,
    //   payload: auth,
    // });
  };

const doValidateLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    //const validated = await authUseCases.validateLogin();
    // if (!validated) {
    //   dispatch(doRefreshLogin());
    //   return;
    // } else {
    //   dispatch({
    //     type: LOGIN,
    //     payload: authUseCases.getAuth(),
    //   });
    // }
  };

export {
  doToggleNotifications,
  doToggleWeather,
  doRefreshLogin,
  doLogout,
  doValidateLogin,
};
