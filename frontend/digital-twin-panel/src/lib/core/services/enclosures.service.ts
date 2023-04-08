import type { enclosuresService } from "src/app/config/config";
import type {
  UserParcels,
  Summary,
  DailyWeather,
  NDVI,
  ForecastWeather,
  HistoricalWeather,
  Enclosure,
} from "../Domain";
import type { IParcelsRepository } from "../ports/Repository";
import type { IenclosuresService } from "../ports/Services";

class EnclosuresService implements IenclosuresService {
  constructor(private readonly parcelsRepository: IParcelsRepository) {}

  getUserParcels(userId: string): Promise<UserParcels> {
    return this.parcelsRepository.getUserParcels(userId);
  }
  getEnclosures(enclosureIds: string[]): Promise<Enclosure[]> {
    return this.parcelsRepository.getEnclosures(enclosureIds, 2022);
  }
  getOverviewSummary(userId: string): Promise<Summary> {
    return this.parcelsRepository.getOverviewSummary(userId);
  }
  getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]> {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return this.parcelsRepository.getHistoricalWeather(
      idema,
      startDate,
      endDate
    );
  }
  getDailyWeather(enclosureId: string): Promise<DailyWeather> {
    // Get the current day like this: 2022-10-31T00:00:00.000Z in ISO format
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.parcelsRepository.getDailyWeather(enclosureId, date);
  }
  getForecastWeather(enclosureId: string): Promise<ForecastWeather> {
    return this.parcelsRepository.getForecastWeather(enclosureId);
  }
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<NDVI[]> {
    return this.parcelsRepository.getNDVI(
      enclosureIds,
      startDate,
      endDate,
      limit
    );
  }
  getTreatments(enclosureId: string, startDate: Date, endDate: Date) {
    return this.parcelsRepository.GetTreatments(
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

export default EnclosuresService;
