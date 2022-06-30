import { decodeToken, isExpired } from "react-jwt";
import { ACCESS_TOKEN_KEY } from "../app/config/constants";
import { FieldsPerArea, Field, AreasPerUser, Result } from "../core/Domain";
import { MustRefreshSession } from "../core/Exceptions";
import AuthRestApi from "./data-sources/rest-api/AuthData";
import FieldRestAPI from "./data-sources/rest-api/FieldsData";

interface IFieldRepository {
  getFieldsInArea(areaId: string): Promise<FieldsPerArea>;
  getField(fieldId: string): Promise<Field>;
}

interface IAreaRepository {
  getAreasByUser(userId: string): Promise<AreasPerUser>;
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

  async getFieldsInArea(areaId: string): Promise<FieldsPerArea> {
    return this.data.getFieldsInArea(areaId);
  }
  async getField(fieldId: string): Promise<Field> {
    return this.data.getField(fieldId);
  }
}

class AreaRepository implements IAreaRepository {
  private data: FieldRestAPI;

  constructor(data: FieldRestAPI) {
    this.data = data;
  }

  async getAreasByUser(userId: string): Promise<AreasPerUser> {
    return this.data.getAreasByUser(userId);
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
      return { isError: true, error: new MustRefreshSession() };
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

export { FieldRepository, AreaRepository, AuthRepository };
export type { IFieldRepository, IAreaRepository, IAuthRepository };
