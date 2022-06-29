interface IFieldService {
  getFieldsInArea(areaId: string): Promise<FieldsPerArea>;
  getField(fieldId: string): Promise<Field>;
}

interface IAreaService {
  getAreasByUser(userId: string): Promise<AreasPerUser>;
}

interface IAuthService {
  logout(): Promise<Result<boolean>>;
  refresh(): Promise<Result<string>>;
}
