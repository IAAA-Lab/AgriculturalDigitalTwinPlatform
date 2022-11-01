import type { AxiosInstance } from "axios";
import type {
  DailyWeather,
  NDVI,
  Parcel,
  Summary,
  UserParcels,
} from "src/lib/core/Domain";
import { ServerError } from "src/lib/core/Exceptions";
import type { IParcelsRepository } from "src/lib/core/ports/Repository";

class HttpParcelsRepository implements IParcelsRepository {
  constructor(private readonly http: AxiosInstance) {}

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
  async getEnclosures(enclosureIds: string[]): Promise<Parcel[]> {
    return this.http
      .get<Parcel[]>("parcels/ref", {
        params: {
          enclosureIds,
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
  async getOverviewSummary(userId: string): Promise<Summary> {
    return this.http
      .get<Summary>("parcels/ref", {
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
  async getForecastWeather(
    parcelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyWeather[]> {
    return this.http
      .get<DailyWeather[]>("weather/forecast", {
        params: {
          parcelId,
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
