import { LatLng } from "leaflet";
import { Coordinates } from "../../core/Domain";

var Colors: any = {};
Colors.names = [
  "#FF1102",
  "#3DFF02",
  "#0259FF",
  "#D902FF",
  "#000000",
  "#FFFFFF",
  "#02FF9A",
  "#FF0271",
  "#FF9F02",
  "#02FFB1",
  "#FF0202",
  "#96BF6A",
  "#5485A3",
  "#903A7D",
  "#A0A0A0",
  "#FFE26E",
  "#EE9D51",
];

const COLORS_SIZE = Colors.names.length;

const getColorList = (n: number) => {
  const mod = n % COLORS_SIZE;
  return n > COLORS_SIZE
    ? Colors.names.slice(0).concat(Colors.names.slice(0, mod))
    : Colors.names.slice(0, n);
};

const numberWithCommas = (num?: number) => {
  return Number(num).toLocaleString("es-ES", { maximumFractionDigits: 2 });
};

const getCoordsCentroid = (coords: Coordinates[]): Coordinates => {
  const x = coords.map((xy) => xy.lat);
  const y = coords.map((xy) => xy.lng);
  return {
    lat: (Math.min(...x) + Math.max(...x)) / 2,
    lng: (Math.min(...y) + Math.max(...y)) / 2,
  };
};

export { getColorList, numberWithCommas };
