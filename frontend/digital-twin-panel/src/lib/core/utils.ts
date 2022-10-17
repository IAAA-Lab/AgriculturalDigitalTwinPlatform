import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import leaflet from "leaflet";

// Fixes default icons of markers in leaflet
const fixDefaultLeafletIcons = () => {
  delete leaflet.Icon.Default.prototype._getIconUrl;
  leaflet.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });
};

const numberWithCommas = (num?: number) => {
  return num! < 0
    ? "N/A"
    : Number(num).toLocaleString("es-ES", { maximumFractionDigits: 2 });
};

export { fixDefaultLeafletIcons, numberWithCommas };
