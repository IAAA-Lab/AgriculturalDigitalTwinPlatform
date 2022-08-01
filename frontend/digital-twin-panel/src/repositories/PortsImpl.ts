import { decodeToken } from "react-jwt";
import { DEFAULT_AUTH } from "../app/config/constants";
import { Auth, Features, Parcel, Result, Terrain } from "../core/Domain";
import { MustRefreshSessionError } from "../core/Exceptions";
import { IAuthService, IFieldService } from "../core/Ports";
import { IAuthRepository, IFieldRepository } from "./Repositories";

class AuthService implements IAuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }
  validateLogin(): Promise<Result<boolean>> {
    return this.authRepository.validateLogin();
  }

  logout(): Promise<Result<boolean>> {
    return this.authRepository.logout();
  }
  async refresh(): Promise<Result<Auth>> {
    const res = await this.authRepository.refresh();
    if (res.isError) {
      return res;
    }
    return this.getAuth();
  }

  getAuth(): Result<Auth> {
    const res = this.authRepository.getAccessToken();
    if (res.isError) {
      return { isError: true, error: new MustRefreshSessionError() };
    }
    const auth: Auth = decodeToken(res.data) ?? DEFAULT_AUTH;
    return { isError: false, data: auth };
  }
}
class FieldService implements IFieldService {
  private fieldRepository: IFieldRepository;
  private authRepository: IAuthRepository;

  constructor(
    fieldRepository: IFieldRepository,
    authRepository: IAuthRepository
  ) {
    this.fieldRepository = fieldRepository;
    this.authRepository = authRepository;
  }
  calculateCommons(terrain: Terrain): Terrain {
    // Check if we have a saved terrain in sessionStorage
    const savedTerrain = this.fieldRepository.getSavedTerrain();
    if (savedTerrain) return savedTerrain;
    // If dont, calculate commons
    if (terrain.parcels?.isError) {
      return terrain;
    }
    let newTerrain = { ...terrain };
    if (newTerrain.parcels?.isError) return terrain;
    let sumParcels: Features[] = [];
    let totalSum: Features[] = [];

    try {
      terrain.parcels?.data.forEach((parcel, i) => {
        sumParcels = JSON.parse(
          JSON.stringify(
            parcel.current.enclosures[0].current.info.characteristics
          )
        );
        parcel.current.enclosures.forEach((enclosure, j) => {
          if (j > 0) {
            enclosure.current.info.characteristics.forEach(
              (characteristic, k) => {
                sumParcels[k].value += characteristic.value;
              }
            );
          }
        });
        this.calculateRulesCharacteristics(
          sumParcels,
          parcel.current.enclosures.length
        );
        if (newTerrain.parcels?.isError) {
          return;
        }
        newTerrain.parcels!.data[i].current.commons = JSON.parse(
          JSON.stringify(sumParcels)
        );
        if (i === 0) {
          totalSum = JSON.parse(JSON.stringify(sumParcels));
        } else {
          sumParcels.forEach((e, h) => {
            totalSum[h].value += e.value;
          });
        }
      });
      this.calculateRulesCharacteristics(
        totalSum,
        terrain.parcels?.data.length!
      );
      newTerrain.commons = JSON.parse(JSON.stringify(totalSum));
    } catch (e) {
      console.error(e);
      return terrain;
    }
    //
    this.fieldRepository.saveTerrain(newTerrain);
    return newTerrain;
  }

  calculateRulesCharacteristics(characteristics: Features[], n: number) {
    characteristics.forEach((characteristic) => {
      switch (characteristic.name) {
        case "Pendiente media":
        case "Coef. de regadío":
        case "Salud plantas (NDVI)":
          characteristic.value /= n;
      }
    });
  }

  async getParcels(): Promise<Result<Parcel[]>> {
    const terrain = this.fieldRepository.getSavedTerrain();
    if (terrain) return terrain.parcels!;
    const auth = this.authRepository.getAccessToken();
    if (auth.isError) return auth;
    return this.fieldRepository.getParcels(auth.data);
  }
}

export { FieldService, AuthService };
