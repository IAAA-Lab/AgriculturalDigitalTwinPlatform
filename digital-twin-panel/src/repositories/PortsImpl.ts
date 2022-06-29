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

  logout(): Promise<Result<boolean>> {
    return this.authRepository.logout();
  }
  refresh(): Promise<Result<string>> {
    return this.authRepository.refresh();
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
