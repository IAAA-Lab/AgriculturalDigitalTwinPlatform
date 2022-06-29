// Set up the configuration for the application
// Dependency injection

import AreaUseCases from "../../core/usecases/areaUseCases";
import AuthUseCases from "../../core/usecases/authUseCases";
import FieldUseCases from "../../core/usecases/fieldUseCases";
import AuthRestApi from "../../repositories/data-sources/rest-api/AuthData";
import FieldRestAPI from "../../repositories/data-sources/rest-api/FieldsData";
import {
  AreaService,
  AuthService,
  FieldService,
} from "../../repositories/PortsImpl";
import {
  AreaRepository,
  AuthRepository,
  FieldRepository,
} from "../../repositories/Repositories";

// -- Auth Use Cases --

const authRestAPI = new AuthRestApi();
const authRepository = new AuthRepository(authRestAPI);
const authService = new AuthService(authRepository);
const authUseCases = new AuthUseCases(authService);

// -- Field Use Cases --

const fieldRestAPI = new FieldRestAPI();
const fieldRepository = new FieldRepository(fieldRestAPI);
const fieldService = new FieldService(fieldRepository);
const fieldUseCases = new FieldUseCases(fieldService);

// -- Area Use Cases --

const areaRestAPI = new FieldRestAPI();
const areaRepository = new AreaRepository(areaRestAPI);
const areaService = new AreaService(areaRepository);
const areaUseCases = new AreaUseCases(areaService);

export { fieldUseCases, areaUseCases, authUseCases };
