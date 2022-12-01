enum AppRoutes {
  OVERVIEW = "/",
  MAP = "/map",
  ANALYTICS = "/analytics",
  SIMULATION = "/simulation",
  SETTINGS = "/settings",
  ENCLOSURE = "/enclosure",
  ENCLOSURE_OVERVIEW = "/enclosure/:id",
  ENCLOSURE_MAP = "/enclosure/:id/map",
  ENCLOSURE_WEATHER = "/enclosure/:id/weather",
  ENCLOSURE_CROPS = "/enclosure/:id/crops",
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const MOBILE_WIDTH = 480;
const TABLET_WIDTH = 640;
const DESKTOP_WIDTH = 820;

export {
  AppRoutes,
  MOBILE_WIDTH,
  TABLET_WIDTH,
  DESKTOP_WIDTH,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
};
