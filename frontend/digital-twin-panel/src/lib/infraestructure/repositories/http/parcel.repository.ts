import type { AxiosInstance } from "axios";
import type {
  ForecastWeather,
  DailyWeather,
  NDVI,
  Parcel,
  Summary,
  UserParcels,
  Fertilizer,
  HistoricalWeather,
  Phytosanitary,
} from "src/lib/core/Domain";
import { ServerError } from "src/lib/core/Exceptions";
import type { IParcelsRepository } from "src/lib/core/ports/Repository";

class HttpParcelsRepository implements IParcelsRepository {
  constructor(private readonly http: AxiosInstance) {}
  async getEnclosures(enclosureIds: string[]): Promise<Parcel[]> {
    return [];
  }
  async getOverviewSummary(userId: string): Promise<Summary> {
    return null;
  }
  async getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]> {
    return [];
  }
  async getPhytosanitaries(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Phytosanitary[]> {
    return [];
  }
  async getFertilizers(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Fertilizer[]> {
    return [];
  }
  async getCropStats(enclosureId: string): Promise<any[]> {
    return [];
  }

  setAuthorizationHeader(authorization: string): void {
    this.http.defaults.headers.common["Authorization"] = authorization;
  }

  async getUserParcels(userId: string): Promise<UserParcels> {
    return this.http
      .get<UserParcels>("parcels/ref", {
        params: {
          userId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw ServerError;
      })
      .catch((_) => {
        throw ServerError;
      });
  }

  async getDailyWeather(parcelId: string, date: Date): Promise<DailyWeather> {
    return this.http
      .get<DailyWeather>("weather/daily", {
        params: {
          parcelId,
          date,
        },
      })
      .then((response) => {
        console.log({ response });
        if (response.status === 200) {
          return response.data;
        }
        throw ServerError;
      })
      .catch((_) => {
        throw ServerError;
      });
  }
  async getForecastWeather(parcelId: string): Promise<ForecastWeather> {
    return this.http
      .get<DailyWeather[]>("weather/forecast", {
        params: {
          parcelId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw ServerError;
      })
      .catch((_) => {
        throw ServerError;
      });
  }
  async getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<NDVI[]> {
    return this.http
      .get<NDVI[]>("ndvi", {
        params: {
          enclosureIds,
          startDate,
          endDate,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw ServerError;
      })
      .catch((_) => {
        throw ServerError;
      });
  }
}

export default HttpParcelsRepository;
