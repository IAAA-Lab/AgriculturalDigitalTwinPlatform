import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import appReducer from "./app-reducers";
import thunk from "redux-thunk";
import { useDispatch } from "react-redux";
import { User, Result } from "../../../../core/Domain";

// ...

type Args = {
  toggleNotifications?: boolean;
  toggleWeather?: boolean;
  user?: Result<User>;
};

interface State {
  toggleNotifications: boolean;
  toggleWeather: boolean;
  user?: Result<User>;
  copyWith: (args: Args) => State;
}

export const AppState: State = {
  toggleNotifications: false,
  toggleWeather: false,
  user: undefined,
  copyWith({ toggleNotifications, toggleWeather, user }: Args) {
    this.toggleNotifications = toggleNotifications ?? this.toggleNotifications;
    this.toggleWeather = toggleWeather ?? this.toggleWeather;
    this.user = user ?? this.user;
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
