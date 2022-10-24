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
  getDailyWeather(
    parcelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]> {
    return this.parcelsRepository.getDailyWeather(parcelId, startDate, endDate);
  }
  getForecastWeather(
    parcelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]> {
    return this.parcelsRepository.getForecastWeather(
      parcelId,
      startDate,
      endDate
    );
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
