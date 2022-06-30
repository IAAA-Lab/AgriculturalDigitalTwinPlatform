import { decodeToken } from "react-jwt";
import { DEFAULT_AUTH } from "../app/config/constants";
import {
  AreasPerUser,
  Auth,
  Field,
  FieldsPerArea,
  Result,
} from "../core/Domain";
import { MustRefreshSession } from "../core/Exceptions";
import {
  IAreaRepository,
  IAuthRepository,
  IFieldRepository,
} from "./Repositories";

class AuthService implements IAuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }
  validateLogin(): Promise<Result<boolean>> {
    return this.authRepository.validateLogin();
  }

  logout(): Promise<Result<boolean>> {
    return this.authRepository.logout();
  }
  async refresh(): Promise<Result<Auth>> {
    const res = await this.authRepository.refresh();
    if (res.isError) {
      return res;
    }
    return this.getAuth();
  }

  getAuth(): Result<Auth> {
    const res = this.authRepository.getAccessToken();
    if (res.isError) {
      return { isError: true, error: new MustRefreshSession() };
    }
    const auth: Auth = decodeToken(res.data) ?? DEFAULT_AUTH;
    return { isError: false, data: auth };
  }
}
class FieldService implements IFieldService {
  private fieldRepository: IFieldRepository;

  constructor(fieldRepository: IFieldRepository) {
    this.fieldRepository = fieldRepository;
  }
  getFieldsInArea(areaId: string): Promise<FieldsPerArea> {
    return this.fieldRepository.getFieldsInArea(areaId);
  }
  getField(fieldId: string): Promise<Field> {
    return this.fieldRepository.getField(fieldId);
  }
}

class AreaService implements IAreaService {
  private fieldRepository: IAreaRepository;

  constructor(fieldRepository: IAreaRepository) {
    this.fieldRepository = fieldRepository;
  }

  getAreasByUser(userId: string): Promise<AreasPerUser> {
    return this.fieldRepository.getAreasByUser(userId);
  }
}

export { FieldService, AreaService, AuthService };
