import { Parcel, Terrain } from "./Domain";

interface IFieldService {
  getParcels(): Promise<Result<Parcel[]>>;
  calculateCommons(terrain: Terrain): Terrain;
}

interface IAuthService {
  logout(): Promise<Result<boolean>>;
  refresh(): Promise<Result<Auth>>;
  validateLogin(): Promise<Result<boolean>>;
  getAuth(): Result<Auth>;
}
