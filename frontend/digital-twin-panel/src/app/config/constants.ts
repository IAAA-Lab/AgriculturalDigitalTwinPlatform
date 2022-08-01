import { Auth, Role } from "../../core/Domain";

const API_URL = process.env.REACT_APP_API_URL;
const LANDING_URL = process.env.REACT_APP_LANDING_URL;

const DEFAULT_AUTH: Auth = {
  user: "",
  role: Role.PLAIN,
  user_id: "",
};
const ACCESS_TOKEN_KEY = "jwtToken";

export { API_URL, LANDING_URL, DEFAULT_AUTH, ACCESS_TOKEN_KEY };
