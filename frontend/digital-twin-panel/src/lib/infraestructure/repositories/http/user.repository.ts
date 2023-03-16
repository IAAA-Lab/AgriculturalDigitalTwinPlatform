import type { AxiosInstance } from "axios";
import {
  LogoutError,
  MustLoginAgainError,
  MustRefreshSessionError,
} from "src/lib/core/Exceptions";
import type { IUserRepository } from "src/lib/core/ports/Repository";

class HttpUserRepository implements IUserRepository {
  constructor(private readonly http: AxiosInstance) {}

  setAuthorizationHeader(authorization: string): void {
    this.http.defaults.headers.common["Authorization"] = authorization;
  }

  async validateLogin(): Promise<void> {
    return this.http
      .get("auth/validate")
      .then((response) => {
        if (response.status !== 200) {
          throw MustLoginAgainError;
        }
      })
      .catch((_) => {
        throw MustLoginAgainError;
      });
  }
  async logout(): Promise<void> {
    return this.http
      .get("auth/logout")
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
      .get<string>("auth/refresh")
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
}

export default HttpUserRepository;
