import { IAreaService } from "../Ports";

class AreaUseCases {
  areaService: IAreaService;

  constructor(areaService: IAreaService) {
    this.areaService = areaService;
  }

  async getAreasByUser(userId: string): Promise<Area[]> {
    return this.areaService.getAreasByUser(userId);
  }
}

export default AreaUseCases;
