import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import appReducer from "./app-reducers";
import thunk from "redux-thunk";
import { useDispatch } from "react-redux";
import Auth, { Result } from "models/auth";
import { MustLoginAgainError } from "errors/Exceptions";

// ...

type Args = {
  toggleSidebar?: boolean;
  auth?: Result<Auth>;
};

interface State {
  toggleSidebar?: boolean;
  auth?: Result<Auth>;
  copyWith: (args: Args) => State;
}

export const AppState: State = {
  auth: { isError: true, error: new MustLoginAgainError() },
  copyWith({ auth, toggleSidebar }: Args) {
    this.auth = auth ?? this.auth;
    this.toggleSidebar = toggleSidebar ?? this.toggleSidebar;
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
