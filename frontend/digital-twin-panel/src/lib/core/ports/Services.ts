import type {
  User,
  DailyWeather,
  NDVI,
  Summary,
  UserParcels,
  ForecastWeather,
  HistoricalWeather,
  Enclosure,
  Treatment,
} from "../Domain";

interface IenclosuresService {
  getUserParcels(userId: string): Promise<UserParcels>;
  getEnclosures(enclosureIds: string[], year: number): Promise<Enclosure[]>;
  getOverviewSummary(userId: string): Promise<Summary>;
  getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]>;
  getDailyWeather(enclosureId: string): Promise<DailyWeather>;
  getForecastWeather(enclosureId: string): Promise<ForecastWeather>;
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<NDVI[]>;
  getCropStats(enclosureId: string): Promise<any[]>;
  getTreatments(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Treatment[]>;
}

interface IUserService {
  logout(): Promise<void>;
  refresh(): Promise<void>;
  validateLogin(): Promise<void>;
}

export type { IenclosuresService, IUserService };
