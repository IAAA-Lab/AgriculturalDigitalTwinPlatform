import { Icon, LatLngBounds } from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { Parcel, Result } from "../../../../../core/Domain";
import { getColorList } from "../../../PortsImpl";
import { RecenterButton } from "../../components/RecenterButton";
import { HomeGeoList } from "./HomeGeoList";

type Props = {
  parcelList?: Result<Parcel[]>;
};

export const HomeMap = ({ parcelList }: Props) => {
  const navigation = useNavigate();
  const [showList, setShowList] = useState(false);

  if (!parcelList) {
    return (
      <div className="leaflet-wrapper mb-8">
        <Skeleton height={"100%"} width={1000} />
      </div>
    );
  }

  if (parcelList.isError) {
    return <></>;
  }

  const colors = getColorList(parcelList.data.length);
  const totalCoords = parcelList.data.map((e) => [
    e.current.info.coordinates.lat,
    e.current.info.coordinates.lng,
  ]);

  return (
    <>
      <div className="leaflet-wrapper">
        <div className="badge-wrapper" style={{ overflow: "hidden" }}>
          <MapContainer
            bounds={new LatLngBounds(totalCoords as any)}
            boundsOptions={{
              padding: [50, 50],
            }}
            zoom={14}
            scrollWheelZoom={false}
          >
            <TileLayer
              maxZoom={15}
              minZoom={5}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            {parcelList.data.map((area, i) => {
              const popUp = document
                .getElementsByClassName("leaflet-tooltip-home-map")
                .item(i);
              return (
                <Marker
                  key={area.id}
                  eventHandlers={{
                    click: () => navigation(`${area.id}`),
                    mouseover: () => {
                      popUp?.classList.add("isHovered");
                    },
                    mouseout: () => {
                      popUp?.classList.remove("isHovered");
                    },
                  }}
                  icon={
                    new Icon({
                      iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(
                        `<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" version="1.1" class="si-glyph si-glyph-pin-location-1"><title>Pin-location-1</title><g stroke="white" stroke-width="0.25" fill="none" fill-rule="evenodd"><g transform="translate(2.000000, 0.000000)" 
                        fill="${colors[i]}"><g transform="translate(2.000000, 0.000000)"><rect x="4" y="6" width="0.956" height="7.944" class="si-glyph-fill"></rect><path d="M4.511,0.016 C2.047,0.016 0.047,2.024 0.047,4.5 C0.047,6.978 2.047,8.984 4.511,8.984 C6.976,8.984 8.975,6.977 8.975,4.5 C8.975,2.023 6.977,0.016 4.511,0.016 L4.511,0.016 Z M4.67,1.642 C3.002,1.642 1.652,2.985 1.652,4.639 C1.652,5.301 1.004,4.985 1.004,3.994 C1.004,2.34 2.354,0.997 4.022,0.997 C5.018,0.997 5.336,1.642 4.67,1.642 L4.67,1.642 Z" class="si-glyph-fill"></path></g><path d="M8.109,11.156 L8.109,12.082 C10.586,12.33 11.838,13.144 11.838,13.552 C11.838,14.061 9.951,15.053 6.494,15.053 C3.035,15.053 1.148,14.061 1.148,13.552 C1.148,13.114 2.49,12.371 4.906,12.131 L4.906,11.204 C2.527,11.415 0.034,12.142 0.034,13.564 C0.034,15.162 3.283,15.997 6.494,15.997 C9.703,15.997 12.953,15.162 12.953,13.564 C12.953,12.102 10.393,11.361 8.109,11.156 L8.109,11.156 Z" class="si-glyph-fill"></path></g></g></svg>`
                      )}`,
                      iconSize: [41, 41],
                      popupAnchor: [1, -25],
                    })
                  }
                  position={area.current.info.coordinates}
                >
                  <Tooltip
                    className="leaflet-tooltip-home-map"
                    interactive
                    permanent
                    direction="top"
                  >
                    <p>{area.id}</p>
                  </Tooltip>
                </Marker>
              );
            })}
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
        <HomeGeoList parcelList={parcelList.data} showList={showList} />
      </div>
    </>
  );
};
