// Set up the configuration for the application
// Dependency injection

import AuthUseCases from "../../core/usecases/authUseCases";
import FieldUseCases from "../../core/usecases/fieldUseCases";
import AuthRestApi from "../../repositories/data-sources/rest-api/AuthData";
import FieldRestAPI from "../../repositories/data-sources/rest-api/FieldsData";
import { AuthService, FieldService } from "../../repositories/PortsImpl";
import {
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
const fieldService = new FieldService(fieldRepository, authRepository);
const fieldUseCases = new FieldUseCases(fieldService);

export { fieldUseCases, authUseCases };
