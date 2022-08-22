import { doRefreshLogin, doValidateLogin } from "contexts/redux/app-actions";
import { RootState, useTypedDispatch } from "contexts/redux/app-store";
import {
  MustRefreshSessionError,
  MustLoginAgainError,
} from "errors/Exceptions";
import Auth, { Result, Role } from "models/auth";
import { useEffect } from "react";
import { useSelector } from "react-redux";

type Props = {
  children: any;
};

const AuthProtection = ({ children }: Props) => {
  const dispatch = useTypedDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(doValidateLogin());
  }, []);

  if (!auth) {
    window.location.href = "/";
    return <></>;
  }
  if (auth?.isError) {
    if (auth.error instanceof MustRefreshSessionError) {
      dispatch(doRefreshLogin());
      return <>Loading.....</>;
    }
    if (auth.error instanceof MustLoginAgainError) {
      window.location.href = "/";
      return <>Inicia sesión...</>;
    }
    window.location.href = "/";
    return <>Error al cargar la página...</>;
  }

  return <>{children}</>;
};

export default AuthProtection;
