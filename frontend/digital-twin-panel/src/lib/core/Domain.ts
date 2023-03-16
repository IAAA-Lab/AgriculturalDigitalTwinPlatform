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
  cropIds: CropId[];
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

type Parcel = {
  id: string;
  ts: Date;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
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
    features: Enclosure[];
  };
};

type Enclosure = {
  id: string;
  ts: Date;
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    imageUri: string;
    protectedArea: boolean;
    ndvi: {
      value: number;
      state: StateNames;
    };
    area: {
      value: number;
      unit: string;
    };
    slope: {
      value: number;
      unit: string;
    };
    irrigation: {
      value: number;
      unit: string;
    };
    usedArea: {
      value: number;
      unit: string;
    };

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

type CropStat = {
  enclosureId: string;
  cropId: CropId;
  stats: {
    title: string;
    value: number;
    diff: number;
    unit?: string;
  };
};

type Fertilizer = {
  enclosureId: string;
  crop: CropId;
  name: string;
  startDate: Date;
  quantity: number;
};

type Phytosanitary = {
  enclosureId: string;
  crop: CropId;
  startDate: Date;
  endDate: Date;
  product: string;
  registrationNumber: string;
  plague: string;
  area: number;
  dosage: number;
  efficacy: string;
  hap: {
    id: string;
    description: string;
    romaCode: string;
    adquisitionDate: Date;
    lastInspectionDate: Date;
  };
  had: {
    id: string;
    name: string;
    nifCode: string;
    ropoCode: string;
    carnetType: string;
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
  type: string;
  skyState: skyState;
  parcelId: string;
  probPrec: number;
  snowProb: number;
  tamin: number;
  tamax: number;
  hrMin: number;
  hrMax: number;
  windSpeed: number;
  uvMax: number;
  date: Date;
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
  CropStat,
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
