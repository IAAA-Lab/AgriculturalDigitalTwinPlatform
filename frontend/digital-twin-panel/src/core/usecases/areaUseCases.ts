import { AreasPerUser } from "../Domain";

class AreaUseCases {
  private areaService: IAreaService;

  constructor(areaService: IAreaService) {
    this.areaService = areaService;
  }

  async getAreasByUser(userId: string): Promise<AreasPerUser> {
    return this.areaService.getAreasByUser(userId);
  }
}

export default AreaUseCases;
