import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  Tooltip,
} from "react-leaflet";
import { EnclosureToolTipContent } from "../../components/FieldPopUp";
import { Link, useNavigate } from "react-router-dom";
import { Enclosure } from "../../../../../core/Domain";
import Skeleton from "react-loading-skeleton";
import { getColorList } from "../../../PortsImpl";
import { ParcelGeoList } from "./ParcelGeoList";
import { useState } from "react";
import { LatLngBounds } from "leaflet";
import { RecenterButton } from "../../components/RecenterButton";

type Props = {
  enclosures?: Enclosure[];
};

export const AreaMap = ({ enclosures }: Props) => {
  const navigation = useNavigate();
  const [showList, setShowList] = useState(false);

  if (!enclosures) {
    return (
      <div className="leaflet-wrapper mb-8">
        <Skeleton height={"100%"} width={1000} />
      </div>
    );
  }

  const colorList = getColorList(enclosures.length);
  const totalCoords = enclosures.flatMap((e) =>
    e.info.coordinates.map((c) => [c.lat, c.lng])
  );

  return (
    <div className="leaflet-wrapper">
      <div className="badge-wrapper" style={{ overflow: "hidden" }}>
        <MapContainer
          bounds={new LatLngBounds(totalCoords as any)}
          boundsOptions={{
            padding: [25, 25],
          }}
          zoom={15}
          minZoom={11}
          maxZoom={17}
          scrollWheelZoom={false}
        >
          <TileLayer
            maxZoom={18}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {enclosures?.map((enclosure, index) => (
            <Link to={`${enclosure.id}`} key={index}>
              <Polyline
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  click: (_) => {
                    navigation(`${enclosure.id}`);
                  },
                }}
                positions={enclosure.info.coordinates}
                fill={true}
                fillOpacity={0.4}
                color={colorList[index]}
                weight={3}
                opacity={0.8}
              >
                <Tooltip
                  interactive
                  direction="top"
                  sticky
                  className="leaflet-tooltip-parcel-map"
                  opacity={1}
                >
                  <EnclosureToolTipContent
                    name={enclosure.id}
                    imageUri={
                      enclosure.imageUri ??
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fields_below_Frocester_Hill_%281565%29.jpg/1200px-Fields_below_Frocester_Hill_%281565%29.jpg"
                    }
                  />
                </Tooltip>
              </Polyline>
            </Link>
          ))}
          <RecenterButton coords={totalCoords} />
        </MapContainer>
        <div
          className="badge-image-field"
          onClick={() => setShowList(!showList)}
        >
          <img
            src={
              require("../../../../../app/assets/images/icons/list-icon.svg")
                .default
            }
          />
        </div>
      </div>
      <ParcelGeoList enclosures={enclosures} showList={showList} />
    </div>
  );
};
