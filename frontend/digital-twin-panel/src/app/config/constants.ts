import { User, Role } from "../../core/Domain";

const API_URL = process.env.REACT_APP_API_URL;
const LANDING_URL = process.env.REACT_APP_LANDING_URL;
const PANEL_URL = process.env.REACT_APP_PANEL_URL;
const IMAGES_URL = process.env.REACT_APP_IMAGES_URL;

const DEFAULT_AUTH: User = {
  email: "",
  role: Role.PLAIN,
  user_id: "",
};
const ACCESS_TOKEN_KEY = "accesstoken";

export {
  API_URL,
  LANDING_URL,
  DEFAULT_AUTH,
  ACCESS_TOKEN_KEY,
  PANEL_URL,
  IMAGES_URL,
};
