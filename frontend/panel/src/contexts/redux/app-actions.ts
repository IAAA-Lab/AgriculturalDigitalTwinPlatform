import { AnyAction } from "redux";
import { RootState, store } from "./app-store";
import { ThunkAction } from "redux-thunk";
import { LOGOUT, REFRESH_LOGIN, LOGIN, TOGGLE_SIDEBAR } from "./types";
import { authService } from "api/auth";
import { LoginError, MustLoginAgainError } from "errors/Exceptions";
import Auth from "models/auth";
import { decodeToken, isExpired } from "react-jwt";
import { ACCESS_TOKEN_KEY } from "contexts/contants";

const doToggleSidebar =
  (closed?: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    if (closed) {
      dispatch({
        type: TOGGLE_SIDEBAR,
        payload: false,
      });
      return;
    }
    dispatch({
      type: TOGGLE_SIDEBAR,
      payload: !store.getState().toggleSidebar,
    });
  };

const doLogout =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    await authService.logout();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatch({
      type: LOGOUT,
      payload: {
        isError: true,
        error: new MustLoginAgainError(),
      },
    });
  };

const doRefreshLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const token = await authService.refreshLogin();
    if (!token) {
      dispatch({
        type: LOGIN,
        payload: {
          isError: true,
          error: new MustLoginAgainError(),
        },
      });
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    const { user, role, user_id } = decodeToken(token) as any;
    dispatch({
      type: LOGIN,
      payload: {
        isError: false,
        data: {
          user,
          role,
          user_id,
        } as Auth,
      },
    });
  };

const doLogin =
  (
    email: string,
    password: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    const token = await authService.login(email, password);
    if (!token) {
      dispatch({
        type: LOGIN,
        payload: {
          isError: true,
          error: new LoginError(),
        },
      });
      return;
    }
    const { user, role, user_id } = decodeToken(token) as any;
    dispatch({
      type: LOGIN,
      payload: {
        isError: false,
        data: {
          user,
          role,
          user_id,
        } as Auth,
      },
    });
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.location.href = "/management/profile/details";
  };

const doValidateLogin =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || isExpired(token)) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      dispatch(doRefreshLogin());
      return;
    }
    const { user, role, user_id } = decodeToken(token) as any;
    dispatch({
      type: LOGIN,
      payload: {
        isError: false,
        data: {
          user,
          role,
          user_id,
        } as Auth,
      },
    });
  };

export { doRefreshLogin, doLogout, doLogin, doValidateLogin, doToggleSidebar };
