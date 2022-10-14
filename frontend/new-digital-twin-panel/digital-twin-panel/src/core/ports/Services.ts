import { Result, User } from "../Domain";

interface IFieldService {
  // getParcels(): Promise<Result<Parcel[]>>;
}

interface IAuthService {
  logout(): Promise<Result<boolean>>;
  refresh(): Promise<Result<User>>;
  validateLogin(): Promise<Result<boolean>>;
  getAuth(): Result<User>;
}

export type { IFieldService, IAuthService };
