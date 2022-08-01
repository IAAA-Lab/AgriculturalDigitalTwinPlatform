import { Parcel, Result } from "../../../../core/Domain";
import { AppState } from "./app-store";
import {
  TOGGLE_NOTIFICATIONS,
  TOGGLE_WEATHER,
  LOGOUT,
  REFRESH_LOGIN,
  LOGIN,
  SET_PARCELS,
  SET_PARCELS_COMMONS,
} from "./types";

export default function appReducer(state = AppState, action: any) {
  switch (action.type) {
    case TOGGLE_NOTIFICATIONS:
      return state.copyWith({ toggleNotifications: action.payload });
    case TOGGLE_WEATHER:
      return state.copyWith({ toggleWeather: action.payload });
    case LOGOUT:
    case REFRESH_LOGIN:
    case LOGIN:
      return state.copyWith({ auth: action.payload });
    case SET_PARCELS:
      return state.copyWith({
        terrain: {
          ...state.terrain!,
          parcels: action.payload,
        },
      });
    case SET_PARCELS_COMMONS:
      return state.copyWith({
        terrain: action.payload,
      });
    default:
      return state;
  }
}
