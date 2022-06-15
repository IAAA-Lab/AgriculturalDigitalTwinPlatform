import { IAreaService, IFieldService } from "../core/Ports";
import { IAreaRepository, IFieldRepository } from "./Repositories";

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

export { FieldService, AreaService };
