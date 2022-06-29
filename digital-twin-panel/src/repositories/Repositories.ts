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
    return this.data.logout();
  }

  async refresh(): Promise<Result<string>> {
    return this.data.refresh();
  }
}

export { FieldRepository, AreaRepository, AuthRepository };
export type { IFieldRepository, IAreaRepository, IAuthRepository };
