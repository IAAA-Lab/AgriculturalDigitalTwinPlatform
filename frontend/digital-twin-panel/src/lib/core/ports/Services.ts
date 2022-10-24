import type {
  User,
  DailyWeather,
  NDVI,
  Parcel,
  Summary,
  UserParcels,
} from "../Domain";

interface IParcelsService {
  getUserParcels(userId: string): Promise<UserParcels>;
  getEnclosures(enclosureIds: string[]): Promise<Parcel[]>;
  getOverviewSummary(userId: string): Promise<Summary>;
  getDailyWeather(
    parcelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]>;
  getForecastWeather(
    parcelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]>;
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]>;
}

interface IUserService {
  logout(): Promise<void>;
  refresh(): Promise<void>;
  validateLogin(): Promise<void>;
}

export type { IParcelsService, IUserService };
