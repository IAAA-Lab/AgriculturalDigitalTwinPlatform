import { AppState } from "./app-store";
import { LOGOUT, REFRESH_LOGIN, LOGIN, TOGGLE_SIDEBAR } from "./types";

export default function appReducer(state = AppState, action: any) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return state.copyWith({ toggleSidebar: action.payload });
    case LOGOUT:
    case REFRESH_LOGIN:
    case LOGIN:
      return state.copyWith({ auth: action.payload });
    default:
      return state;
  }
}
