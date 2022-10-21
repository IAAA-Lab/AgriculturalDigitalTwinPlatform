import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import leaflet from "leaflet";

// Handle sidebar toggle
const toggleSidebar = (hide: boolean = true) => {
  const sidebar = document.getElementsByClassName("sidebar")[0];
  console.log(sidebar);
  if (hide) {
    sidebar?.classList.toggle("not-active");
    return;
  }
  // Toggle
  sidebar?.classList.toggle("not-active");
};

// Fixes default icons of markers in leaflet
const fixDefaultLeafletIcons = () => {
  delete leaflet.Icon.Default.prototype._getIconUrl;
  leaflet.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });
};

// Formats a number to a string with a fixed number of decimals
const numberWithCommas = (num?: number) => {
  return num! < 0
    ? "N/A"
    : Number(num).toLocaleString("es-ES", { maximumFractionDigits: 2 });
};

const markerMapIconByColor = (color: string) => {
  const iconSvg = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30.000000pt" height="30.000000pt" viewBox="0 0 30.000000 30.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
fill="${color}" stroke="#000000" stroke-width="3">
<path d="M98 264 c-30 -16 -58 -61 -58 -94 0 -31 18 -61 60 -100 20 -19 40
-42 43 -50 6 -13 8 -13 14 0 3 8 23 31 43 50 62 58 73 96 45 150 -28 54 -94
74 -147 44z m92 -54 c25 -25 25 -55 0 -80 -11 -11 -29 -20 -40 -20 -26 0 -60
34 -60 60 0 26 34 60 60 60 11 0 29 -9 40 -20z"/>
<path d="M124 185 c-10 -25 4 -47 28 -43 25 4 37 28 14 28 -9 0 -16 7 -16 15
0 8 -5 15 -10 15 -6 0 -13 -7 -16 -15z"/>
</g>
</svg>`;

  return leaflet.icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(iconSvg)}`,
    shadowUrl: markerShadow,
    iconSize: [50, 50],
    shadowAnchor: [20, 35],
    shadowSize: [70, 60],
  });
};

var Colors: any = {};
Colors.names = [
  "#FF1102",
  "#288cde",
  "#ffb81f",
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

export {
  fixDefaultLeafletIcons,
  numberWithCommas,
  markerMapIconByColor,
  getColorList,
  toggleSidebar,
};
