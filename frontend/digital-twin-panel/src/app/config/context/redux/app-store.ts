import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import appReducer from "./app-reducers";
import thunk from "redux-thunk";
import { useDispatch } from "react-redux";
import { Auth, Result, Terrain } from "../../../../core/Domain";

// ...

type Args = {
  toggleNotifications?: boolean;
  toggleWeather?: boolean;
  auth?: Result<Auth>;
  terrain?: Terrain;
};

interface State {
  toggleNotifications: boolean;
  toggleWeather: boolean;
  auth?: Result<Auth>;
  terrain?: Terrain;
  copyWith: (args: Args) => State;
}

export const AppState: State = {
  toggleNotifications: false,
  toggleWeather: false,
  auth: undefined,
  terrain: undefined,
  copyWith({ toggleNotifications, toggleWeather, auth, terrain }: Args) {
    this.toggleNotifications = toggleNotifications ?? this.toggleNotifications;
    this.toggleWeather = toggleWeather ?? this.toggleWeather;
    this.auth = auth ?? this.auth;
    this.terrain = terrain ?? this.terrain;
    // Because we have to change the object reference in order to trigger a re-render
    return Object.assign({}, this);
  },
};

export const store = configureStore({
  middleware: [thunk],
  reducer: appReducer,
  preloadedState: AppState,
});

export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
