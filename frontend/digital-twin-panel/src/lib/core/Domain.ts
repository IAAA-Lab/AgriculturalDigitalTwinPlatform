import type CustomError from "./Exceptions";

enum Role {
  ADMIN = "admin",
  NEWS_EDITOR = "newsEditor",
  PLAIN = "user",
  AGRARIAN = "agrarian",
}

type User = {
  id?: string;
  email: string;
  password?: string;
  role: string;
};

type UserParcels = {
  id?: string;
  userId: string;
  enclosureIds: string[];
  summary: Summary;
};

type SummaryStat = {
  enclosureId: string;
  stat: Characteristics;
  // cropIds: CropId[];
  diff: number;
};

type Summary = {
  ts: Date;
  stats: {
    all: SummaryStat[];
    good: SummaryStat[];
    bad: SummaryStat[];
  };
};

type Characteristics = {
  name: string;
  value: number;
  unit?: string;
  state: StateNames;
};

type Enclosure = {
  id: string;
  year: number;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  meteoStation: {
    idema: string;
    name: string;
    "distance(km)": number;
  };
  properties: {
    irrigationCoef: number;
    admisibility: number;
    geographicSpot: string;
    crop: Crop;
    areaSIGPAC: number;
    area: number;
    varietyId: string;
    rainfedOrIrrigated: string;
    tenureRegimeId: string;
    plantationYear: number;
    numberOfTrees: number;
    plantationDensity: number;
    vulnerableArea: boolean;
    specificZones: boolean;
    parcelUse: string;
    slope: number;
    uhc: number;
    uhcDescription: string;
    zepaZone: boolean;
    sieZone: boolean;
  };
};

type Crop = {
  id: string;
  name: string;
  variety: string;
  varietyId: number;
  codeType: string;
  plantationKind?: string;
  plantationSubKind?: string;
};

type Fertilizer = {
  enclosureId: string;
  crop: Crop;
  name: string;
  startDate: Date;
  quantity: number;
};

type Treatment = {
  id: string;
  date: Date;
  broth: number;
  doseKind: number;
  doseMovement: number;
  quantity: number;
  doseUnit: string;
  healthAgent: {
    id: number;
    name: string;
  };
  phytosanitary: {
    id: number;
    name: string;
    formula: string;
  };
  plague: {
    id: number;
    name: string;
  };
};

type NDVI = {
  enclosureId: string;
  date: string;
  value: number;
};

type NDVIMap = {
  type: string;
  date: string;
  imageUri: string;
};

type FarmHolder = {
  name: string;
  id: FarmHolderId;
  address: {
    zip: string;
    municipality: string;
    province: string;
    ccaa: string;
  };
  phones: string[];
  email: string;
};

type FarmHolderId = {
  type: string;
  code: string;
};

type HistoricalWeather = {
  type: string;
  parcelId: string;
  tmed: number;
  prec: number;
  tmin: number;
  tminTime: string;
  tmax: number;
  tmaxTime: string;
  windSpeed: number;
  windGust: number;
  windGustTime: string;
  date: string;
};

type ForecastWeather = {
  origin: origin;
  type: string;
  parcelId: string;
  elaboratedAt: Date;
  municipality: string;
  province: string;
  prediction: {
    day: Day[];
  };
};

type Day = {
  probPrec: ProbPrec[];
  snowQuote: SkyState[];
  skyState: SkyState[];
  wind: Wind[];
  ta: Ta;
  hr: Hr;
  uvMax: number;
  date: Date;
};

type Hr = {
  hrmax: number;
  hrmin: number;
};

type ProbPrec = {
  value: number;
  period: string;
};

type SkyState = {
  value: string;
  period: string;
  description?: string;
};

type Ta = {
  tamax: number;
  tamin: number;
};

type Wind = {
  direction: string;
  speed: number;
  period: string;
};

type DailyWeather = {
  type: string;
  parcelId: string;
  origin: origin;
  elaboratedAt: string;
  municipality: string;
  province: string;
  prediction: Prediction[];
};

type origin = {
  producer: string;
  web: string;
  language: string;
  copyright: string;
  legalNote: string;
};

type Prediction = {
  skyState: skyState[];
  prec: genericState[];
  probPrec: genericState[];
  probStorm: genericState[];
  snow: genericState[];
  probSnow: genericState[];
  ta: genericState[];
  hr: genericState[];
  wind: windState[];
  date: Date;
  dawn: string;
  sunset: string;
};

type skyState = {
  value: string;
  period: string;
  description?: string;
};

type genericState = {
  value: number;
  period: string;
};

type windState = {
  direction: string;
  speed: number;
  period: string;
  value?: number;
};

enum StateNames {
  GOOD = "BIEN",
  MEDIUM = "MEDIO",
  BAD = "MAL",
  NA = "NA",
}

type Characteristic = {
  name: string;
  value: number;
  unit?: string;
  state?: StateNames;
};

type Result<T> = { error?: CustomError; data?: T };

export type {
  Result,
  User,
  Characteristic,
  Enclosure,
  Crop,
  Fertilizer,
  Treatment,
  NDVI,
  NDVIMap,
  FarmHolder,
  FarmHolderId,
  ForecastWeather,
  DailyWeather,
  UserParcels,
  Summary,
  SummaryStat,
  Characteristics,
  Prediction,
  HistoricalWeather,
};

export { Role, StateNames };
