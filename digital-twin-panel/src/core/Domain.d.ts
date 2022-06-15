enum CharacteristicState {
  GOOD = "BIEN",
  MEDIUM = "MEDIO",
  BAD = "MAL",
  NA = "NA",
}

type GeoLocation = {
  lat: number;
  lng: number;
};

type FieldCharacteristics = {
  name: string;
  value: number;
  unit?: string;
  state?: CharacteristicState;
};

type Disease = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};

type FieldProfile = {
  id: string;
  name: string;
  description: string;
  plantType: string;
  geoBoundaries: GeoLocation[];
  imageUrl: string;
};

type FieldsPerArea = {
  fields: Field[];
  features: {
    characteristics: FieldCharacteristics[];
    distinctCharacteristics: string[];
  };
};

type Field = {
  fieldProfile: FieldProfile;
  characteristics: FieldCharacteristics[];
  diseases: Disease[];
};

type AreasPerUser = {
  areas: Area[];
  features: {
    characteristics: FieldCharacteristics[];
    distinctCharacteristics: string[];
  };
};

type Area = {
  id: string;
  name: string;
  geoLocation: GeoLocation;
  characteristics: FieldCharacteristics[];
};
