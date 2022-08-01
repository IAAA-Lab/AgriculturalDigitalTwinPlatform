import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { Coordinates } from "../../../../core/Domain";

type Props = {
  coords: number[][];
};

export const RecenterButton = ({ coords }: Props) => {
  const map = useMap();
  return (
    <div
      className="badge-recenter"
      onClick={() =>
        map.fitBounds(new LatLngBounds(coords as any), {
          padding: [50, 50],
        })
      }
    >
      <img
        src={
          require("../../../../app/assets/images/icons/recenter.svg").default
        }
      />
    </div>
  );
};
