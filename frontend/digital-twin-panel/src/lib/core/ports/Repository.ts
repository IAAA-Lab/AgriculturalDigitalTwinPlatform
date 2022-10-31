import type {
  DailyWeather,
  NDVI,
  Parcel,
  Summary,
  UserParcels,
} from "../Domain";

interface IParcelsRepository {
  getUserParcels(userId: string): Promise<UserParcels>;
  getEnclosures(enclosureIds: string[]): Promise<Parcel[]>;
  getOverviewSummary(userId: string): Promise<Summary>;
  getDailyWeather(parcelId: string, date: Date): Promise<DailyWeather[]>;
  getForecastWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]>;
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]>;
}
interface IUserRepository {
  validateLogin(): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<string>;
  setAuthorizationHeader(authorization: string): void;
}
interface IInternalStorageRepository {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export type { IParcelsRepository, IInternalStorageRepository, IUserRepository };
