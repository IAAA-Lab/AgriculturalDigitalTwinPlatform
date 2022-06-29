class CustomError {
  cause?: Error;
  message: string;

  constructor(cause?: Error) {
    this.message = message;
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
