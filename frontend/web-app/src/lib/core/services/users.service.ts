import { user } from '$lib/config/stores/user';
import encrypt from '$lib/middleware/encryption';
import jwtDecode from 'jwt-decode';
import type { IUserRepository } from '../ports/Repository';
import type { IUserService } from '../ports/Services';
import type { User } from '../Domain';
import { listOfEnclosures } from '$lib/config/stores/selectedEnclosure';

class UserService implements IUserService {
	constructor(private readonly userRepository: IUserRepository) {}

	async logout(): Promise<void> {
		this.userRepository.setAuthorizationHeader('');
		user.set(null);
		await this.userRepository.logout();
	}
	async refresh(): Promise<User> {
		const jwtRaw = await this.userRepository.refresh();
		this.userRepository.setAuthorizationHeader(`Bearer ${jwtRaw}`);
		const cred = this.extractTokenInfo(jwtRaw);
		user.set(cred);
		return cred;
	}
	async getUserCredentials(): Promise<User> {
		const jwtRaw = await this.userRepository.validateLogin();
		if (!jwtRaw) {
			return await this.refresh();
		}
		const cred = this.extractTokenInfo(jwtRaw);
		user.set(cred);
		return cred;
	}
	async login(username: string, password: string): Promise<void> {
		const encryptedMsg = await encrypt(JSON.stringify({ email: username, password }));
		const jwtRaw = await this.userRepository.login(encryptedMsg);
		this.userRepository.setAuthorizationHeader(`Bearer ${jwtRaw}`);
		user.set(this.extractTokenInfo(jwtRaw));
	}
	async getEnclosureIds(userId: string): Promise<void> {
		listOfEnclosures.set(await this.userRepository.getEnclosureIds(userId));
	}

	extractTokenInfo(rawToken: string): User {
		const jwt = jwtDecode<any>(rawToken);
		return {
			id: jwt.user_id,
			name: jwt.user,
			role: jwt.role
		};
	}
}

export default UserService;
