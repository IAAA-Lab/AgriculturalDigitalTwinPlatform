class CustomError {
  cause?: Error;
  message: string = "error";

  constructor(cause?: Error) {
    this.cause = cause;
  }
}

class LogoutError extends CustomError {
  message = "Logout ha fallado";
}
class BackendError extends CustomError {
  message = "Ocurrió un problema con el servidor";
}
class MustLoginAgainError extends CustomError {
  message = "Debe volver a iniciar sesión otra vez";
}

class MustRefreshSession extends CustomError {
  message = "Debe volver a revalidar la sesión";
}

export default CustomError;
export { LogoutError, BackendError, MustLoginAgainError, MustRefreshSession };
