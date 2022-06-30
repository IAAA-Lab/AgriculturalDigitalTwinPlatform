import { FieldsPerArea, Field } from "../Domain";

class FieldUseCases {
  private fieldService: IFieldService;

  constructor(fieldService: IFieldService) {
    this.fieldService = fieldService;
  }

  async getAllFieldsInArea(areaId: string): Promise<FieldsPerArea> {
    return this.fieldService.getFieldsInArea(areaId);
  }

  async getField(fieldId: string): Promise<Field> {
    return this.fieldService.getField(fieldId);
  }
}

export default FieldUseCases;
