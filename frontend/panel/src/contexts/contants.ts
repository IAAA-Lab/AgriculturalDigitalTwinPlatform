import Auth, { Role } from "models/auth";

const API_URL = process.env.REACT_APP_API_URL;
const AGRARIAN_PANEL_URI = process.env.REACT_APP_AGRARIAN_PANEL_URI;
const NEWS_UPLOAD_URI = process.env.REACT_APP_NEWS_UPLOAD_URL;
const KEY_DECRYPT_PASSWD = process.env.REACT_APP_KEY_DECRYPT_PASSWD;
const IV_BLOCK_PASSWD = process.env.REACT_APP_IV_BLOCK_PASSWD;
const GRAPHANA_URI =
  "http://localhost:3000/d/FDB061FMz/gin-application-metrics?orgId=1&refresh=5s";

const DEFAULT_AUTH: Auth = {
  user: "",
  role: Role.PLAIN,
  user_id: "",
};

const DEFAULT_NEWS_IMAGE =
  "https://i.pinimg.com/originals/0a/3f/3f/0a3f3fe4b482a8853bf63364d9a3bc6a.jpg";
const ACCESS_TOKEN_KEY = "accesstoken";

export {
  AGRARIAN_PANEL_URI,
  NEWS_UPLOAD_URI,
  KEY_DECRYPT_PASSWD,
  IV_BLOCK_PASSWD,
  API_URL,
  ACCESS_TOKEN_KEY,
  DEFAULT_NEWS_IMAGE,
  GRAPHANA_URI,
};
