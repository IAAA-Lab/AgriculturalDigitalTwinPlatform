import { ACCESS_TOKEN_KEY } from "../app/config/constants";
import { Parcel, Result, Terrain } from "../core/Domain";
import { MustRefreshSessionError } from "../core/Exceptions";
import AuthRestApi from "./data-sources/rest-api/AuthData";
import FieldRestAPI from "./data-sources/rest-api/FieldsData";

interface IFieldRepository {
  getParcels(accessToken: string): Promise<Result<Parcel[]>>;
  getSavedTerrain(): Terrain | undefined;
  saveTerrain(terrain: Terrain): void;
}

interface IAuthRepository {
  logout(): Promise<Result<boolean>>;
  refresh(): Promise<Result<string>>;
  validateLogin(): Promise<Result<boolean>>;
  getAccessToken(): Result<string>;
}

class FieldRepository implements IFieldRepository {
  private data: FieldRestAPI;

  constructor(data: FieldRestAPI) {
    this.data = data;
  }

  async getParcels(accessToken: string): Promise<Result<Parcel[]>> {
    return this.data.getParcelsByUser(accessToken);
  }

  getSavedTerrain(): Terrain | undefined {
    try {
      return JSON.parse(sessionStorage.getItem("terrain")!) as Terrain;
    } catch (e) {
      console.error(e);
    }
  }

  saveTerrain(terrain: Terrain) {
    sessionStorage.setItem("terrain", JSON.stringify(terrain));
  }
}

class AuthRepository implements IAuthRepository {
  private data: AuthRestApi;

  constructor(data: AuthRestApi) {
    this.data = data;
  }

  async logout(): Promise<Result<boolean>> {
    const resAt = this.getAccessToken();
    this.deleteAccessToken();
    return this.data.logout(resAt.isError ? "" : resAt.data);
  }

  async refresh(): Promise<Result<string>> {
    const res = await this.data.refresh();
    if (!res.isError) {
      this.setAccessToken(res.data);
    }
    return res;
  }

  async validateLogin(): Promise<Result<boolean>> {
    const resAt = this.getAccessToken();
    if (resAt.isError) {
      this.deleteAccessToken();
      return resAt;
    }
    return this.data.validateLogin(resAt.data);
  }

  getAccessToken(): Result<string> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      return { isError: true, error: new MustRefreshSessionError() };
    }
    return { isError: false, data: accessToken };
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  private deleteAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export { FieldRepository, AuthRepository };
export type { IFieldRepository, IAuthRepository };
