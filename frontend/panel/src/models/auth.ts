import CustomError from "errors/Exceptions";

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

type ResultSuccess<T> = { isError: false; data: T };
type ResultError = { isError: true; error: CustomError };
type Result<T> = ResultSuccess<T> | ResultError;

export { Role };
export type { Result };
export default Auth;
