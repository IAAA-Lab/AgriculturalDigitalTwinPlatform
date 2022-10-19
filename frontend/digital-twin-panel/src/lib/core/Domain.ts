import CustomError from "./Exceptions";

enum Role {
  ADMIN = "admin",
  NEWS_EDITOR = "newsEditor",
  PLAIN = "user",
  AGRARIAN = "agrarian",
}

type User = {
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

type Characteristic = {
  name: string;
  value: number;
  unit?: string;
  state?: CharacteristicState;
};

type ResultSuccess<T> = { isError: false; data: T };
type ResultError = { isError: true; error: CustomError };
type Result<T> = ResultSuccess<T> | ResultError;

export type { Result, User, CharacteristicState, Characteristic };

export { Role };
