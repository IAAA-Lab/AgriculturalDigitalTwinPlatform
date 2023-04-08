import { ACCESS_TOKEN_KEY } from "src/app/config/constants";
import type {
  IInternalStorageRepository,
  IUserRepository,
} from "../ports/Repository";
import type { IUserService } from "../ports/Services";

class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly InternalStorageRepository: IInternalStorageRepository
  ) {}

  logout(): Promise<void> {
    this.userRepository.logout();
    this.InternalStorageRepository.remove(ACCESS_TOKEN_KEY);
    this.userRepository.setAuthorizationHeader("");
    return Promise.resolve();
  }
  async refresh(): Promise<void> {
    try {
      const accessToken = await this.userRepository.refresh();
      this.InternalStorageRepository.set(ACCESS_TOKEN_KEY, accessToken);
      this.userRepository.setAuthorizationHeader(`Bearer ${accessToken}`);
    } catch (error) {
      this.InternalStorageRepository.remove(ACCESS_TOKEN_KEY);
      this.userRepository.setAuthorizationHeader("");
      return Promise.reject(error);
    }
  }
  validateLogin(): Promise<void> {
    try {
      return this.userRepository.validateLogin();
    } catch (error) {
      this.InternalStorageRepository.remove(ACCESS_TOKEN_KEY);
      this.userRepository.setAuthorizationHeader("");
      return Promise.reject(error);
    }
  }
}

export default UserService;
