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
  value: string;
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

type Field = {
  fieldProfile: FieldProfile;
  characteristics: FieldCharacteristics[];
  diseases: Disease[];
};

type Area = {
  id: string;
  name: string;
  geoLocation: GeoLocation;
  characteristics: FieldCharacteristics[];
};
