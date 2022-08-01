import CustomError from "./Exceptions";

enum Role {
  ADMIN = "admin",
  NEWS_EDITOR = "newsEditor",
  PLAIN = "user",
  AGRARIAN = "agrarian",
}

type Auth = {
  user: string;
  role: Role;
  user_id: string;
};

enum CharacteristicState {
  GOOD = "BIEN",
  MEDIUM = "MEDIO",
  BAD = "MAL",
  NA = "NA",
}

type Coordinates = {
  lat: number;
  lng: number;
};

type Characteristics = {
  name: string;
  value: number;
  unit?: string;
  state?: CharacteristicState;
};

type Crops = {
  name: string;
  variety: string;
  imageUri?: string;
};

type Fertilizers = {
  name: string;
  startDate: Date;
  quantity: number;
};

type Phytosanitaries = {};

type Enclosure = {
  id: string;
  imageUri?: string;
  current: {
    info: EnclosureInfo;
  };
};

type EnclosureInfo = {
  ts: Date;
  characteristics: Characteristics[];
  coordinates: Coordinates[];
  ndvi: {
    avg: number;
  };
  crops?: Crops[];
  fertilizers?: Fertilizers[];
  phytosanitaries?: Phytosanitaries[];
};

type Parcel = {
  ts: Date;
  id: string;
  current: {
    ts: Date;
    info: ParcelInfo;
    commons?: Characteristics[];
    enclosures: Enclosure[];
  };
};

type ParcelInfo = {
  coordinates: Coordinates;
};

type Terrain = {
  commons?: Characteristics[];
  parcels?: Result<Parcel[]>;
};

type ChartDataOptions = Map<
  string,
  {
    labels: string[];
    values: number[];
  }
>;

type TableDataOptions = {
  key: string;
}[];

type ResultSuccess<T> = { isError: false; data: T };
type ResultError = { isError: true; error: CustomError };
type Result<T> = ResultSuccess<T> | ResultError;

export type {
  Result,
  Characteristics as Features,
  Auth,
  CharacteristicState,
  Parcel,
  Enclosure,
  ParcelInfo,
  Terrain,
  ChartDataOptions,
  Coordinates,
};

export { Role };
