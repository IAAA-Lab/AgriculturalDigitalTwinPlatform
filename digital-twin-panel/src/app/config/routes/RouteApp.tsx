import { useJwt } from "react-jwt";

type Props = {
  children: any;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isExpired } = useJwt(localStorage.getItem("jwtToken") || "");

  if (!isExpired) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
