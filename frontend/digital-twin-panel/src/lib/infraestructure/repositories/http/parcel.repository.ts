import type { AxiosInstance } from "axios";
import type {
  ForecastWeather,
  DailyWeather,
  NDVI,
  Summary,
  UserParcels,
  Fertilizer,
  HistoricalWeather,
  Treatment,
  Enclosure,
} from "src/lib/core/Domain";
import { ServerError } from "src/lib/core/Exceptions";
import type { IParcelsRepository } from "src/lib/core/ports/Repository";

class HttpParcelsRepository implements IParcelsRepository {
  constructor(private readonly http: AxiosInstance) {}
  async getEnclosures(
    enclosureIds: string[],
    year: number
  ): Promise<Enclosure[]> {
    return this.http
      .post<Enclosure[]>("enclosures", {
        enclosureIds,
        year,
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
    return null;
  }
  async getHistoricalWeather(
    idema: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalWeather[]> {
    return this.http
      .get<HistoricalWeather[]>("weather/historical", {
        params: {
          idema,
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
  async GetTreatments(
    enclosureId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Treatment[]> {
    return this.http
      .get<Treatment[]>("treatments", {
        params: {
          enclosureId,
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
        throw new ServerError("Error al obtener los campos del usuario");
      })
      .catch((e) => {
        throw new ServerError(e);
      });
  }

  async getDailyWeather(
    enclosureId: string,
    date: Date
  ): Promise<DailyWeather> {
    return this.http
      .get<DailyWeather>("weather/daily", {
        params: {
          enclosureId,
          date,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new ServerError("Error al obtener el tiempo del día");
      })
      .catch((e) => {
        throw new ServerError(e);
      });
  }
  async getForecastWeather(enclosureId: string): Promise<ForecastWeather> {
    return this.http
      .get<ForecastWeather>("weather/forecast", {
        params: {
          enclosureId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new ServerError("Error al obtener el pronóstico del tiempo");
      })
      .catch((e) => {
        throw new ServerError(e);
      });
  }
  async getNDVI(
    enclosureIds: string[],
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<NDVI[]> {
    return this.http
      .post<NDVI[]>("ndvi", {
        enclosureIds,
        startDate,
        endDate,
        limit,
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new ServerError("Error al obtener NDVI");
      })
      .catch((e) => {
        throw new ServerError(e);
      });
  }
}

export default HttpParcelsRepository;
