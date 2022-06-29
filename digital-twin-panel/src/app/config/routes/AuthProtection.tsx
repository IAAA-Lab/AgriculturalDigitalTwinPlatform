import { useSelector } from "react-redux";
import {
  MustLoginAgainError,
  MustRefreshSession,
} from "../../../core/Exceptions";
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
