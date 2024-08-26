import { MustLoginAgainError, LogoutError, MustRefreshSessionError } from '$lib/core/Exceptions';
import type { IUserRepository } from '$lib/core/ports/Repository';
import type { AxiosInstance } from 'axios';
import jwtDecode from 'jwt-decode';

class HttpUserRepository implements IUserRepository {
	constructor(private readonly http: AxiosInstance) {}

	setAuthorizationHeader(authorization: string): void {
		this.http.defaults.headers.common['Authorization'] = authorization;
	}

	async validateLogin(): Promise<string | null> {
		// Check if axios authorization header is set and read the jwt token
		const authorization = this.http.defaults.headers.common['Authorization'] as string;
		if (!authorization) return null;
		// Check if the token is valid
		const jwtRaw = authorization.split(' ')[1];
		const jwt = jwtDecode<any>(jwtRaw);
		if (!jwt) return null;
		// Check if the token is expired
		const now = new Date().getTime() / 1000;
		if (now > jwt.ex) return null;
		return jwtRaw;
	}

	async login(body: string): Promise<string> {
		return this.http
			.post(
				'auth/login',
				JSON.stringify({
					data: body
				}),
				{
					withCredentials: true
				}
			)
			.then((response) => {
				if (response.status !== 200) {
					throw MustLoginAgainError;
				}
				return response.data;
			})
			.catch((e) => {
				throw MustLoginAgainError;
			});
	}

	async logout(): Promise<void> {
		return this.http
			.post('auth/logout', {}, { withCredentials: true })
			.then((response) => {
				if (response.status !== 200) {
					throw LogoutError;
				}
			})
			.catch((_) => {
				throw LogoutError;
			});
	}
	async refresh(): Promise<string> {
		return this.http
			.post<string>('auth/refresh', {}, { withCredentials: true })
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				throw MustRefreshSessionError;
			})
			.catch((_) => {
				throw MustRefreshSessionError;
			});
	}

	async getDigitalTwinIds(userId: string): Promise<string[]> {
		return this.http
			.get<string[]>(`users/${userId}/enclosures`, {
				withCredentials: true
			})
			.then((response) => {
				if (response.status !== 200) {
					throw MustLoginAgainError;
				}
				return response.data;
			})
			.catch((e) => {
				throw MustLoginAgainError;
			});
	}
}

export default HttpUserRepository;
