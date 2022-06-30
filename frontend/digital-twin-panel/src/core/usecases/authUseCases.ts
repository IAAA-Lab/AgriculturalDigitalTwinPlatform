import { Result, Auth } from "../Domain";

class AuthUseCases {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async logout(): Promise<boolean> {
    return !(await this.authService.logout()).isError;
  }

  async refresh(): Promise<Result<Auth>> {
    return this.authService.refresh();
  }

  async validateLogin(): Promise<boolean> {
    const res = await this.authService.validateLogin();
    return !res.isError;
  }

  getAuth(): Result<Auth> {
    return this.authService.getAuth();
  }
}

export default AuthUseCases;
