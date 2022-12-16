import type {
  DailyWeather,
  Fertilizer,
  ForecastWeather,
  HistoricalWeather,
  NDVI,
  Parcel,
  Phytosanitary,
  Summary,
  UserParcels,
} from "../Domain";

interface IParcelsRepository {
  getUserParcels(userId: string): Promise<UserParcels>;
  getEnclosures(enclosureIds: string[]): Promise<Parcel[]>;
  getOverviewSummary(userId: string): Promise<Summary>;
  getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]>;
  getDailyWeather(parcelId: string, date: Date): Promise<DailyWeather>;
  getForecastWeather(parcelId: string): Promise<ForecastWeather[]>;
  getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]>;
  getPhytosanitaries(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Phytosanitary[]>;
  getFertilizers(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Fertilizer[]>;
  getCropStats(enclosureId: string): Promise<any[]>;
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
