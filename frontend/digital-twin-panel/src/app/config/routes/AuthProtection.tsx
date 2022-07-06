import { Auth, Result } from "../../../core/Domain";
import {
  MustLoginAgainError,
  MustRefreshSession,
} from "../../../core/Exceptions";
import { LANDING_URL } from "../constants";
import { doRefreshLogin } from "../context/redux/app-actions";
import { useTypedDispatch } from "../context/redux/app-store";

type Props = {
  children: any;
  auth: Result<Auth>;
};

const AuthProtection = ({ children, auth }: Props) => {
  const dispatch = useTypedDispatch();
  if (auth.isError) {
    if (auth.error instanceof MustRefreshSession) {
      dispatch(doRefreshLogin());
      return <>Loading.....</>;
    }
    if (auth.error instanceof MustLoginAgainError) {
      window.location.href = LANDING_URL!;
      return <>Inicia sesión...</>;
    }
    return <>Error al cargar la página...</>;
  }

  return <>{children}</>;
};

export default AuthProtection;
