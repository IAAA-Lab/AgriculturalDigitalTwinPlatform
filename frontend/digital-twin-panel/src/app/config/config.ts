import axios from "axios";
import EnclosuresService from "src/lib/core/services/enclosures.service";
import UserService from "src/lib/core/services/users.service";
import HttpParcelsRepositoryMock from "src/lib/infraestructure/repositories/http/mocks/parcel.repository.mock";
import HttpParcelsRepository from "src/lib/infraestructure/repositories/http/parcel.repository";
import HttpUserRepository from "src/lib/infraestructure/repositories/http/user.repository";
import LocalStorageRepository from "src/lib/infraestructure/repositories/storage.repository";

const IMAGES_SERVER_URL =
  (import.meta.env.VITE_IMAGES_SERVER_URL as string) ||
  "http://localhost:9000/web-images";
const DIGITAL_TWIN_API_URL =
  (import.meta.env.VITE_SERVER_URL as string) || "http://localhost:8080";
const BASEPATH = (import.meta.env.VITE_BASE_URL as string) || "";

const digitalTwinHttpInstance = axios.create({
  baseURL: DIGITAL_TWIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// --------- Dependency injection ------------
// Parcels use cases
const parcelsRepository = new HttpParcelsRepository(digitalTwinHttpInstance);
const enclosuresService = new EnclosuresService(parcelsRepository);

// User use cases
const localStorage = new LocalStorageRepository(window.localStorage);
const userRepository = new HttpUserRepository(digitalTwinHttpInstance);
const userService = new UserService(userRepository, localStorage);

export { enclosuresService, userService, IMAGES_SERVER_URL, BASEPATH };
