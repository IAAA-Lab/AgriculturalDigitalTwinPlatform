// Set up the configuration for the application
// Dependency injection

import AreaUseCases from "../../core/usecases/areaUseCases";
import FieldUseCases from "../../core/usecases/fieldUseCases";
import FieldRestAPI from "../../repositories/data-sources/rest-api/FieldsData";
import { AreaService, FieldService } from "../../repositories/PortsImpl";
import {
  AreaRepository,
  FieldRepository,
} from "../../repositories/Repositories";

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

export { fieldUseCases, areaUseCases };
