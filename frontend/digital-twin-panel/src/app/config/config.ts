import axios from "axios";
import ParcelsService from "src/lib/core/services/parcel.service";
import UserService from "src/lib/core/services/user.service";
import HttpParcelsRepositoryMock from "src/lib/infraestructure/repositories/http/mocks/parcel.repository.mock";
import HttpParcelsRepository from "src/lib/infraestructure/repositories/http/mocks/parcel.repository.mock";
import HttpUserRepository from "src/lib/infraestructure/repositories/http/user.repository";
import LocalStorageRepository from "src/lib/infraestructure/repositories/storage.repository";

const IMAGES_SERVER_URL = import.meta.env.IMAGES_SERVER_URL as string;
const DIGITAL_TWIN_API_URL = import.meta.env.DIGITAL_TWIN_API_URL as string;

const digitalTwinHttpInstance = axios.create({
  baseURL: DIGITAL_TWIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// --------- Dependency injection ------------
// Parcels use cases
const parcelsRepositoryMock = new HttpParcelsRepositoryMock(
  digitalTwinHttpInstance
);
const parcelsRepository = new HttpParcelsRepository(digitalTwinHttpInstance);
const parcelsService = new ParcelsService(parcelsRepositoryMock);

// User use cases
const localStorage = new LocalStorageRepository(window.localStorage);
const userRepository = new HttpUserRepository(digitalTwinHttpInstance);
const userService = new UserService(userRepository, localStorage);

export { parcelsService, userService, IMAGES_SERVER_URL };
