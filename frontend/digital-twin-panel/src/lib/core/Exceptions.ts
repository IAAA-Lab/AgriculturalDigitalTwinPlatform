interface CustomError extends Error {
  name: string;
  message: string;
}

const LogoutError: CustomError = {
  name: "LogoutError",
  message: "Error al cerrar sesión",
};

const ServerError: CustomError = {
  name: "ServerError",
  message: "Ocurrió un problema con el servidor",
};

const MustLoginAgainError: CustomError = {
  name: "MustLoginAgainError",
  message: "Debe volver a iniciar sesión",
};

const MustRefreshSessionError: CustomError = {
  name: "MustRefreshSessionError",
  message: "Debe refrescar la sesión",
};

export default CustomError;
export {
  LogoutError,
  ServerError,
  MustLoginAgainError,
  MustRefreshSessionError,
};
