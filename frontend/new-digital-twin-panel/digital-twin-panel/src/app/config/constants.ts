import { Auth, Role } from "../../core/Domain";

const API_URL = import.meta.env.VITE_API_URL;
const LANDING_URL = import.meta.env.VITE_LANDING_URL;
const IMAGES_URL = import.meta.env.VITE_IMAGES_URL;

const DEFAULT_AUTH: Auth = {
  user: "",
  role: Role.PLAIN,
  user_id: "",
};
const ACCESS_TOKEN_KEY = "accesstoken";
const REFRESH_TOKEN_KEY = "refreshtoken";

export {
  API_URL,
  LANDING_URL,
  DEFAULT_AUTH,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  IMAGES_URL,
};
