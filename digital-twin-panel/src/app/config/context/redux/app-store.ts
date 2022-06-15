import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import appReducer from "./app-reducers";
import thunk from "redux-thunk";
import { useDispatch } from "react-redux";
// ...

type Args = {
  toggleNotifications?: boolean;
  toggleWeather?: boolean;
};

interface State {
  toggleNotifications: boolean;
  toggleWeather: boolean;
  copyWith: (args: Args) => State;
}

export const AppState: State = {
  toggleNotifications: false,
  toggleWeather: false,
  copyWith({ toggleNotifications, toggleWeather }: Args) {
    this.toggleNotifications = toggleNotifications ?? this.toggleNotifications;
    this.toggleWeather = toggleWeather ?? this.toggleWeather;
    // Because we have to change the object reference in order to trigger a re-render
    return Object.assign({}, this);
  },
};

export const store = configureStore({
  middleware: [thunk],
  reducer: appReducer,
  preloadedState: AppState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
