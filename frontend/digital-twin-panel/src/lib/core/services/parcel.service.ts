import type {
  UserParcels,
  Parcel,
  Summary,
  DailyWeather,
  NDVI,
} from "../Domain";
import type { IParcelsRepository } from "../ports/Repository";
import type { IParcelsService } from "../ports/Services";

class ParcelsService implements IParcelsService {
  constructor(private readonly parcelsRepository: IParcelsRepository) {}

  getUserParcels(userId: string): Promise<UserParcels> {
    return this.parcelsRepository.getUserParcels(userId);
  }
  getEnclosures(enclosureIds: string[]): Promise<Parcel[]> {
    return this.parcelsRepository.getEnclosures(enclosureIds);
  }
  getOverviewSummary(userId: string): Promise<Summary> {
    return this.parcelsRepository.getOverviewSummary(userId);
  }
  getDailyWeather(parcelId: string): Promise<DailyWeather> {
    // Get the current day like this: 2022-10-31T00:00:00.000Z in ISO format
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    console.log(parcelId);
    return this.parcelsRepository.getDailyWeather(parcelId, date);
  }
  getForecastWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]> {
    return this.parcelsRepository.getForecastWeather(idema, startDate, endDate);
  }
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]> {
    return this.parcelsRepository.getNDVI(enclosureIds, startDate, endDate);
  }
}

export default ParcelsService;
