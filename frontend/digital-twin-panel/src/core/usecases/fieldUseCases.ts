import { Parcel, Result, Terrain } from "../Domain";
import { IFieldService } from "../Ports";

class FieldUseCases {
  private fieldService: IFieldService;

  constructor(fieldService: IFieldService) {
    this.fieldService = fieldService;
  }

  async getParcels(): Promise<Result<Parcel[]>> {
    return this.fieldService.getParcels();
  }

  calculateCommons(terrain: Terrain): Terrain {
    return this.fieldService.calculateCommons(terrain);
  }
}

export default FieldUseCases;
