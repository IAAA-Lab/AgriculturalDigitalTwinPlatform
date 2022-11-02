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
  ts: Date;
  enclosureIds: string[];
  summary: Summary;
};

type SummaryStat = {
  enclosureId: string;
  stat: Characteristics;
  cropIds: CropId[];
  diff: number;
};

type Summary = {
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

type Parcel = {
  id: string;
  ts: Date;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    address: {
      zip: string;
      municipality: string;
      province: string;
      ccaa: string;
    };
    idema: string;
    protectedZones: {
      type: string;
      zones: string[];
    }[];
  };
  enclosures: {
    type: string;
    enclosures: Enclosure[];
  };
};

type Enclosure = {
  id: string;
  ts: Date;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    imageUri: string;
    protectedArea: boolean;
    characteristics: Characteristics[];
    irrigationType: string;
    useType: string;
  };
  cropIds: CropId[];
};

type Crop = {
  name: string;
  variety: string;
  imageUri: string;
  production: number;
  area: number;
  performance: number;
  harvest: number;
  characteristics: Characteristics[];
};

type CropId = {
  name: string;
  variety: string;
  imageUri: string;
};

type Fertilizer = {
  enclosureId: string;
  crop: CropId;
  name: string;
  startDate: string;
  quantity: number;
};

type Phytosanitary = {
  enclosureId: string;
  crop: CropId;
  startDate: string;
  endDate: string;
  product: string;
  registrationNumber: string;
  plague: string;
  area: number;
  dosage: number;
  efficacy: number;
  hap: {
    id: string;
    description: string;
    romaCode: string;
    adquisitionDate: string;
    lastInspectionDate: string;
  };
  had: {
    id: string;
    name: string;
    nifCode: string;
    ropoCode: string;
    carnetType: string;
  };
};

type CropStats = {
  date: string;
  enclosureId: string;
  cropId: CropId;
  stats: Characteristics[];
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

type ForecastWeather = {
  type: string;
  parcelId: string;
  idema: string;
  fint: string;
  prec: number;
  tamin: number;
  tamax: number;
  ta: number;
  hr: number;
  tpr: number;
};

type DailyWeather = {
  type: string;
  parcelId: string;
  origin: origin;
  elaboratedAt: string;
  municipality: string;
  province: string;
  prediction: prediction[];
};

type origin = {
  producer: string;
  web: string;
  language: string;
  copyright: string;
  legalNote: string;
};

type prediction = {
  skyState: skyState[];
  prec: genericState[];
  probPrec: genericState[];
  probStorm: genericState[];
  snow: genericState[];
  probSnow: genericState[];
  ta: genericState[];
  hr: genericState[];
  wind: windState[];
  date: string;
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
  Parcel,
  Enclosure,
  Crop,
  CropId,
  Fertilizer,
  Phytosanitary,
  CropStats,
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
};

export { Role, StateNames };
