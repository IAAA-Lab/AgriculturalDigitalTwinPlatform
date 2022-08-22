import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { Coordinates } from "../../../../core/Domain";

type Props = {
  coords: number[][];
};

export const RecenterButton = ({ coords }: Props) => {
  const map = useMap();
  return (
    <a
      className="badge-recenter"
      href="javascript:;"
      title="Recentrar"
      onClick={() =>
        map.fitBounds(new LatLngBounds(coords as any), {
          padding: [50, 50],
        })
      }
    >
      <img
        src={
          require("../../../../app/assets/images/icons/recenter-icon.svg")
            .default
        }
      />
    </a>
  );
};
