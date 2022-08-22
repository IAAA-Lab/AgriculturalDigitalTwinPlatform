import { Auth, Result, Role } from "../../../core/Domain";
import {
  MustLoginAgainError,
  MustRefreshSessionError,
} from "../../../core/Exceptions";
import { LANDING_URL } from "../constants";
import { doRefreshLogin } from "../context/redux/app-actions";
import { useTypedDispatch } from "../context/redux/app-store";

type Props = {
  children: any;
  auth?: Result<Auth>;
};

const AuthProtection = ({ children, auth }: Props) => {
  const dispatch = useTypedDispatch();

  if (auth?.isError) {
    if (auth.error instanceof MustRefreshSessionError) {
      dispatch(doRefreshLogin());
      return <>Loading.....</>;
    }
    if (auth.error instanceof MustLoginAgainError) {
      window.location.href = LANDING_URL!;
      return <>Inicia sesión...</>;
    }
    window.location.href = LANDING_URL!;
    return <>Error al cargar la página...</>;
  }

  if (auth?.data.role !== Role.ADMIN && auth?.data.role !== Role.AGRARIAN) {
    return <>Usuario incorrecto...</>;
  }

  return <>{children}</>;
};

export default AuthProtection;
