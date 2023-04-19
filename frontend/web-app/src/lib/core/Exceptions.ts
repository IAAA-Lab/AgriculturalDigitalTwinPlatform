interface CustomError extends Error {
	name: string;
	message: string;
}

const handleErrorMessage = (error: any) => {
	if (error.response) {
		return error.response.data.message;
	} else if (error.request) {
		return 'Error de conexión';
	} else {
		return error.message;
	}
};

const LogoutError: CustomError = {
	name: 'LogoutError',
	message: 'Error al cerrar sesión'
};

class ServerError extends Error {
	constructor(message = 'Error del servidor') {
		super(handleErrorMessage(message));
		this.name = 'ServerError';
	}
}

const MustLoginAgainError: CustomError = {
	name: 'MustLoginAgainError',
	message: 'Debe volver a iniciar sesión'
};

const MustRefreshSessionError: CustomError = {
	name: 'MustRefreshSessionError',
	message: 'Debe refrescar la sesión'
};

export default CustomError;
export { LogoutError, ServerError, MustLoginAgainError, MustRefreshSessionError };
