import type { AxiosInstance } from "axios";
import axios from "axios";
import type {
  DailyWeather,
  NDVI,
  Parcel,
  Summary,
  UserParcels,
} from "src/lib/core/Domain";
import { StateNames } from "src/lib/core/Domain";
import { ServerError } from "src/lib/core/Exceptions";
import type { IParcelsRepository } from "src/lib/core/ports/Repository";

class HttpParcelsRepositoryMock implements IParcelsRepository {
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
        id: "47-124-0-0-4-560",
        ts: new Date(),
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-4.84464266, 41.29748855],
              [-4.84459238, 41.2974801],
              [-4.84456645, 41.29747796],
              [-4.84453189, 41.29747747],
              [-4.84451654, 41.29747725],
              [-4.84444229, 41.29748753],
              [-4.8444088, 41.29749615],
              [-4.84438993, 41.29749914],
              [-4.844378, 41.2974988],
              [-4.8443522, 41.29749556],
              [-4.84434201, 41.29749198],
              [-4.84432779, 41.29748223],
              [-4.84426886, 41.29742427],
              [-4.84420184, 41.29736068],
              [-4.84409797, 41.29725539],
              [-4.84405273, 41.29720953],
              [-4.84405854, 41.29720254],
              [-4.84401684, 41.29714852],
              [-4.84398253, 41.29710408],
              [-4.84391437, 41.29702426],
              [-4.84386985, 41.29697641],
              [-4.84386479, 41.29697021],
              [-4.84408288, 41.29692069],
              [-4.84420639, 41.29687781],
              [-4.84447208, 41.29677953],
              [-4.84475099, 41.29667877],
              [-4.844852, 41.29661851],
              [-4.84495022, 41.29656497],
              [-4.8450251, 41.29651396],
              [-4.8452466, 41.29640638],
              [-4.8453623, 41.2963503],
              [-4.84545589, 41.29628908],
              [-4.84555746, 41.2962362],
              [-4.8457086, 41.29677618],
              [-4.84570929, 41.29677915],
              [-4.8458395, 41.29737306],
              [-4.8458618, 41.29746961],
              [-4.84586361, 41.29747859],
              [-4.84609011, 41.29857496],
              [-4.84606267, 41.29858284],
              [-4.84584587, 41.29859459],
              [-4.84572289, 41.2986044],
              [-4.84561531, 41.29862281],
              [-4.84560913, 41.29861976],
              [-4.84558766, 41.29860619],
              [-4.84556496, 41.2985876],
              [-4.84553799, 41.29855683],
              [-4.84550281, 41.29850682],
              [-4.84544539, 41.29842775],
              [-4.84538716, 41.29834898],
              [-4.8453327, 41.29827897],
              [-4.84529346, 41.29822863],
              [-4.8452394, 41.29815354],
              [-4.84518164, 41.29807488],
              [-4.8451277, 41.29799441],
              [-4.84506875, 41.29791583],
              [-4.84500977, 41.29783775],
              [-4.84492751, 41.29771785],
              [-4.84487209, 41.29763778],
              [-4.84483716, 41.29759294],
              [-4.84479011, 41.29755135],
              [-4.84473227, 41.29751688],
              [-4.84466507, 41.29749232],
              [-4.84464266, 41.29748855],
            ],
          ],
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
          features: [
            {
              id: "47-124-0-0-4-560-1",
              ts: new Date(),
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-4.84555746, 41.2962362],
                    [-4.8457086, 41.29677618],
                    [-4.84570929, 41.29677915],
                    [-4.8458395, 41.29737306],
                    [-4.8458618, 41.29746961],
                    [-4.84586361, 41.29747859],
                    [-4.84609011, 41.29857496],
                    [-4.84606267, 41.29858284],
                    [-4.84584587, 41.29859459],
                    [-4.84572289, 41.2986044],
                    [-4.84561531, 41.29862281],
                    [-4.84560913, 41.29861976],
                    [-4.84558766, 41.29860619],
                    [-4.84556496, 41.2985876],
                    [-4.84553799, 41.29855683],
                    [-4.84550281, 41.29850682],
                    [-4.84544539, 41.29842775],
                    [-4.84538716, 41.29834898],
                    [-4.8453327, 41.29827897],
                    [-4.84529346, 41.29822863],
                    [-4.8452394, 41.29815354],
                    [-4.84518164, 41.29807488],
                    [-4.8451277, 41.29799441],
                    [-4.84506875, 41.29791583],
                    [-4.84500977, 41.29783775],
                    [-4.84492751, 41.29771785],
                    [-4.84487209, 41.29763778],
                    [-4.84483716, 41.29759294],
                    [-4.84479011, 41.29755135],
                    [-4.84473227, 41.29751688],
                    [-4.84466507, 41.29749232],
                    [-4.84464266, 41.29748855],
                    [-4.84454408, 41.29734306],
                    [-4.84445039, 41.29724233],
                    [-4.84437634, 41.29719365],
                    [-4.84427647, 41.29716658],
                    [-4.84414242, 41.29715751],
                    [-4.84401684, 41.29714852],
                    [-4.84398253, 41.29710408],
                    [-4.84391437, 41.29702426],
                    [-4.84386985, 41.29697641],
                    [-4.84386479, 41.29697021],
                    [-4.84408288, 41.29692069],
                    [-4.84420639, 41.29687781],
                    [-4.84447208, 41.29677953],
                    [-4.84475099, 41.29667877],
                    [-4.844852, 41.29661851],
                    [-4.84495022, 41.29656497],
                    [-4.8450251, 41.29651396],
                    [-4.8452466, 41.29640638],
                    [-4.8453623, 41.2963503],
                    [-4.84545589, 41.29628908],
                    [-4.84555746, 41.2962362],
                  ],
                ],
              },
              properties: {
                imageUri: "https://picsum.photos/200",
                protectedArea: true,
                irrigationType: "Furrow",
                useType: "Fruit trees",
                ndvi: {
                  value: 52,
                  state: StateNames.MEDIUM,
                },
                area: {
                  value: 1987,
                  unit: "ha",
                },
                usedArea: {
                  value: 642,
                  unit: "ha",
                },
                slope: {
                  value: 2,
                  unit: "%",
                },
                irrigation: {
                  value: 80,
                  unit: "%",
                },
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
        id: "47-96-0-0-5-25",
        ts: new Date(),
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-4.82043564, 41.27344698],
              [-4.82046568, 41.2734756],
              [-4.82052487, 41.27350447],
              [-4.82057494, 41.27354061],
              [-4.82068353, 41.27359023],
              [-4.82079279, 41.27365507],
              [-4.82119825, 41.27384006],
              [-4.82124118, 41.27422497],
              [-4.82134587, 41.27443859],
              [-4.82256932, 41.27486481],
              [-4.82268583, 41.27464958],
              [-4.82270484, 41.27464208],
              [-4.82349893, 41.27510129],
              [-4.82359449, 41.27515869],
              [-4.82270124, 41.27528852],
              [-4.82266339, 41.27570345],
              [-4.82266205, 41.27571811],
              [-4.82219519, 41.27595872],
              [-4.82182427, 41.27591964],
              [-4.82165135, 41.27588846],
              [-4.82141448, 41.2758257],
              [-4.81740536, 41.27455586],
              [-4.81744708, 41.27453246],
              [-4.81809632, 41.27433828],
              [-4.81836651, 41.27423088],
              [-4.81887909, 41.2740384],
              [-4.81925792, 41.27397387],
              [-4.81933526, 41.27394302],
              [-4.81944164, 41.27390449],
              [-4.81970272, 41.27380444],
              [-4.81995373, 41.27369032],
              [-4.82019447, 41.27357582],
              [-4.82043564, 41.27344698],
            ],
          ],
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
          features: [
            {
              id: "47-96-0-0-5-25-1",
              ts: new Date(),
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-4.82043564, 41.27344698],
                    [-4.82046568, 41.2734756],
                    [-4.82052487, 41.27350447],
                    [-4.82057494, 41.27354061],
                    [-4.82068353, 41.27359023],
                    [-4.82079279, 41.27365507],
                    [-4.82119825, 41.27384006],
                    [-4.82124118, 41.27422497],
                    [-4.82134587, 41.27443859],
                    [-4.82256932, 41.27486481],
                    [-4.82268583, 41.27464958],
                    [-4.82270484, 41.27464208],
                    [-4.82349893, 41.27510129],
                    [-4.82359449, 41.27515869],
                    [-4.82270124, 41.27528852],
                    [-4.82266339, 41.27570345],
                    [-4.8225148, 41.27577731],
                    [-4.82221175, 41.27594006],
                    [-4.8219258, 41.27591803],
                    [-4.82180869, 41.2759045],
                    [-4.82165344, 41.27587704],
                    [-4.82150913, 41.27583176],
                    [-4.82130444, 41.27576051],
                    [-4.82108591, 41.27569614],
                    [-4.82085138, 41.27563068],
                    [-4.82034082, 41.2754586],
                    [-4.82001173, 41.27535215],
                    [-4.81966521, 41.27524855],
                    [-4.81924711, 41.27510891],
                    [-4.81875265, 41.27494857],
                    [-4.81846799, 41.27485067],
                    [-4.81814812, 41.27475595],
                    [-4.81773019, 41.27462302],
                    [-4.81744708, 41.27453246],
                    [-4.81809632, 41.27433828],
                    [-4.81836651, 41.27423088],
                    [-4.81887909, 41.2740384],
                    [-4.81925792, 41.27397387],
                    [-4.81933526, 41.27394302],
                    [-4.81944164, 41.27390449],
                    [-4.81970272, 41.27380444],
                    [-4.81995373, 41.27369032],
                    [-4.82019447, 41.27357582],
                    [-4.82043564, 41.27344698],
                  ],
                ],
              },
              properties: {
                imageUri: "https://picsum.photos/200",
                protectedArea: true,
                irrigationType: "Furrow",
                useType: "Fruit trees",
                ndvi: {
                  value: 85,
                  state: StateNames.GOOD,
                },
                area: {
                  value: 2300,
                  unit: "ha",
                },
                usedArea: {
                  value: 2000,
                  unit: "ha",
                },
                slope: {
                  value: 2,
                  unit: "%",
                },
                irrigation: {
                  value: 80,
                  unit: "%",
                },
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
  async getDailyWeather(parcelId: string, date: Date): Promise<DailyWeather> {
    return this.http
      .get<DailyWeather>("weather/daily", {
        params: {
          parcelId,
          date,
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

export default HttpParcelsRepositoryMock;
