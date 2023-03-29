import type {
  User,
  DailyWeather,
  NDVI,
  Summary,
  UserParcels,
  ForecastWeather,
  HistoricalWeather,
  Enclosure,
} from "../Domain";

interface IParcelsService {
  getUserParcels(userId: string): Promise<UserParcels>;
  getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
  getOverviewSummary(userId: string): Promise<Summary>;
  getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]>;
  getDailyWeather(parcelId: string): Promise<DailyWeather>;
  getForecastWeather(parcelId: string): Promise<ForecastWeather>;
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]>;
  getCropStats(enclosureId: string): Promise<any[]>;
}

interface IUserService {
  logout(): Promise<void>;
  refresh(): Promise<void>;
  validateLogin(): Promise<void>;
}

export type { IParcelsService, IUserService };
