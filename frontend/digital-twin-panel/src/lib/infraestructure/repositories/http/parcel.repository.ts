import type { AxiosInstance } from "axios";
import {
  StateNames,
  type DailyWeather,
  type NDVI,
  type Parcel,
  type Summary,
  type UserParcels,
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
    return Promise.resolve<Parcel[]>([
      {
        id: "1",
        ts: new Date(),
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.5, 39.5],
        },
        properties: {
          address: {
            zip: "46001",
            municipality: "Valencia",
            province: "Valencia",
            ccaa: "Comunidad Valenciana",
          },
          idema: "46001",
          protectedZones: [
            {
              type: "Natura 2000",
              zones: ["Zona 1", "Zona 2"],
            },
          ],
        },
        enclosures: {
          type: "FeatureCollection",
          enclosures: [
            {
              id: "1",
              ts: new Date(),
              type: "enclosure",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [-0.5, 39.5],
                  [-0.5, 39.6],
                  [-0.4, 39.6],
                  [-0.4, 39.5],
                  [-0.5, 39.5],
                ],
              },
              properties: {
                imageUri: "https://picsum.photos/200",
                protectedArea: true,
                irrigationType: "Furrow",
                useType: "Fruit trees",
                characteristics: [
                  {
                    name: "Humidity",
                    value: 0.5,
                    unit: "%",
                    state: StateNames.GOOD,
                  },
                  {
                    name: "Temperature",
                    value: 0.5,
                    unit: "ºC",
                    state: StateNames.GOOD,
                  },
                  {
                    name: "Soil moisture",
                    value: 0.5,
                    unit: "%",
                    state: StateNames.GOOD,
                  },
                  {
                    name: "Soil temperature",
                    value: 0.5,
                    unit: "ºC",
                    state: StateNames.GOOD,
                  },
                ],
              },
              cropIds: [
                {
                  name: "Pistacho",
                  variety: "Pistacho 3",
                  imageUri: "https://picsum.photos/200",
                },
              ],
            },
          ],
        },
      },
      {
        id: "2",
        ts: new Date(),
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.8, 42.5],
        },
        properties: {
          address: {
            zip: "46001",
            municipality: "Valencia",
            province: "Valencia",
            ccaa: "Comunidad Valenciana",
          },
          idema: "46001",
          protectedZones: [],
        },
        enclosures: {
          type: "FeatureCollection",
          enclosures: [],
        },
      },
    ]);
  }
  async getOverviewSummary(userId: string): Promise<Summary> {
    return Promise.resolve<Summary>({
      stats: {
        all: [
          {
            enclosureId: "123-34-23-1-3-5",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "NDVI",
              value: 0.8,
              state: StateNames.GOOD,
            },
            diff: 1.34,
          },
          {
            enclosureId: "123-34-23-2-3-5",
            cropIds: [
              {
                name: "Pistacho",
                variety: "Pistacho 3",
                imageUri: "https://picsum.photos/200",
              },
              {
                name: "Nuez",
                variety: "Nuez 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "Producción",
              value: 1241,
              unit: "kg",
              state: StateNames.BAD,
            },
            diff: -1.04,
          },
          {
            enclosureId: "123-34-23-1-3-5",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "NDVI",
              value: 0.4,
              state: StateNames.MEDIUM,
            },
            diff: 0.34,
          },
          {
            enclosureId: "123-34-23-1-3-6",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "Rendimiento",
              value: 764,
              unit: "kg/Ha",
              state: StateNames.BAD,
            },
            diff: 0.12,
          },
        ],
        good: [
          {
            enclosureId: "123-34-23-1-3-5",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "NDVI",
              value: 0.8,
              state: StateNames.GOOD,
            },
            diff: 1.34,
          },
          {
            enclosureId: "123-34-23-2-3-5",
            cropIds: [
              {
                name: "Pistacho",
                variety: "Pistacho 3",
                imageUri: "https://picsum.photos/200",
              },
              {
                name: "Nuez",
                variety: "Nuez 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "Producción",
              value: 1241,
              unit: "kg",
              state: StateNames.BAD,
            },
            diff: 1.44,
          },
        ],
        bad: [
          {
            enclosureId: "123-34-23-1-3-5",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "NDVI",
              value: 0.4,
              state: StateNames.MEDIUM,
            },
            diff: 1.12,
          },
          {
            enclosureId: "123-34-23-1-3-6",
            cropIds: [
              {
                name: "Maíz",
                variety: "Maíz 1",
                imageUri: "https://picsum.photos/200",
              },
            ],
            stat: {
              name: "Rendimiento",
              value: 764,
              unit: "kg/Ha",
              state: StateNames.BAD,
            },
            diff: -1.24,
          },
        ],
      },
    });
  }
  // async getEnclosures(enclosureIds: string[]): Promise<Parcel[]> {
  //   return this.http
  //     .get<Parcel[]>("parcels/ref", {
  //       params: {
  //         enclosureIds,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.data;
  //       }
  //       throw ServerError;
  //     })
  //     .catch((_) => {
  //       throw ServerError;
  //     });
  // }
  // async getOverviewSummary(userId: string): Promise<Summary> {
  //   return this.http
  //     .get<Summary>("parcels/ref", {
  //       params: {
  //         userId,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.data;
  //       }
  //       throw ServerError;
  //     })
  //     .catch((_) => {
  //       throw ServerError;
  //     });
  // }
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
