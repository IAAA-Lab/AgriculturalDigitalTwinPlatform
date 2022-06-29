class AuthUseCases {
  authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async logout(): Promise<Result<boolean>> {
    return this.authService.logout();
  }

  async refresh(): Promise<Result<string>> {
    return this.authService.refresh();
  }
}

export default AuthUseCases;
