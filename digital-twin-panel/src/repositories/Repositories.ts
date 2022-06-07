import FieldRestAPI from "./data-sources/rest-api/FieldsData";

interface IFieldRepository {
  getFieldsInArea(areaId: string): Promise<FieldProfile[]>;
  getField(fieldId: string): Promise<Field>;
}

interface IAreaRepository {
  getAreasByUser(userId: string): Promise<Area[]>;
}

class FieldRepository implements IFieldRepository {
  private data: FieldRestAPI;

  constructor(data: FieldRestAPI) {
    this.data = data;
  }

  async getFieldsInArea(areaId: string): Promise<FieldProfile[]> {
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

  async getAreasByUser(userId: string): Promise<Area[]> {
    return this.data.getAreasByUser(userId);
  }
}

export { FieldRepository, AreaRepository };
export type { IFieldRepository, IAreaRepository };
