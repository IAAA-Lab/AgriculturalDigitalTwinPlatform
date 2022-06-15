import { AppState } from "./app-store";
import { TOGGLE_NOTIFICATIONS, TOGGLE_WEATHER } from "./types.d";

export default function appReducer(state = AppState, action: any) {
  switch (action.type) {
    case TOGGLE_NOTIFICATIONS:
      return state.copyWith({ toggleNotifications: action.payload });
    case TOGGLE_WEATHER:
      return state.copyWith({ toggleWeather: action.payload });
    default:
      return state;
  }
}
