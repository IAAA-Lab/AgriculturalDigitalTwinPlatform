import { useSelector, useStore } from "react-redux";
import { Role } from "../../../core/Domain";
import {
  MustLoginAgainError,
  MustRefreshSession,
} from "../../../core/Exceptions";
import { authUseCases } from "../configuration";
import { doRefreshLogin } from "../context/redux/app-actions";
import { RootState, useTypedDispatch } from "../context/redux/app-store";

type Props = {
  children: any;
};

const AuthProtection = ({ children }: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useTypedDispatch();

  if (auth.isError) {
    if (auth.error instanceof MustRefreshSession) {
      dispatch(doRefreshLogin());
      return <>Loading.....</>;
    }
    if (auth.error instanceof MustLoginAgainError) {
      return <>Inicia sesión...</>;
    }
  }

  return <>{children}</>;
};

export default AuthProtection;
