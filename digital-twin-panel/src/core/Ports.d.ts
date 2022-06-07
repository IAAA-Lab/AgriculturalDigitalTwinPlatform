interface IFieldService {
  getFieldsInArea(areaId: string): Promise<FieldProfile[]>;
  getField(fieldId: string): Promise<Field>;
}

interface IAreaService {
  getAreasByUser(userId: string): Promise<Area[]>;
}

export { IFieldService, IAreaService };
