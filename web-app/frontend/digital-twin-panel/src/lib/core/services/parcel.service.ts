import type {
  UserParcels,
  Parcel,
  Summary,
  DailyWeather,
  NDVI,
  ForecastWeather,
  HistoricalWeather,
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
  getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]> {
    return this.parcelsRepository.getHistoricalWeather(
      idema,
      startDate,
      endDate
    );
  }
  getDailyWeather(parcelId: string): Promise<DailyWeather> {
    // Get the current day like this: 2022-10-31T00:00:00.000Z in ISO format
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.parcelsRepository.getDailyWeather(parcelId, date);
  }
  getForecastWeather(parcelId: string): Promise<ForecastWeather[]> {
    return this.parcelsRepository.getForecastWeather(parcelId);
  }
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]> {
    return this.parcelsRepository.getNDVI(enclosureIds, startDate, endDate);
  }
  getPhytosanitaries(enclosureId: string, startDate: Date, endDate: Date) {
    return this.parcelsRepository.getPhytosanitaries(
      enclosureId,
      startDate,
      endDate
    );
  }
  getFertilizers(enclosureId: string, startDate: Date, endDate: Date) {
    return this.parcelsRepository.getFertilizers(
      enclosureId,
      startDate,
      endDate
    );
  }
  getCropStats(enclosureId: string) {
    return this.parcelsRepository.getCropStats(enclosureId);
  }
}

export default ParcelsService;
