import { Icon } from "leaflet";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  CircleMarker,
  useMap,
} from "react-leaflet";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { GeoList } from "./AreaGeoList";

type Props = {
  areaList?: Area[];
};

const MyMarker = (props: any) => {
  const leafletRef = useRef<any>();
  useEffect(() => {
    leafletRef.current.openPopup();
  }, []);
  return <Marker ref={leafletRef} {...props} />;
};

export const HomeMap = ({ areaList }: Props) => {
  const navigation = useNavigate();
  const [showList, setShowList] = useState(false);

  if (!areaList) {
    return (
      <div className="leaflet-wrapper mb-8">
        <Skeleton height={"100%"} width={1000} />
      </div>
    );
  }

  return (
    <>
      <div className="leaflet-wrapper">
        <div className="badge-wrapper" style={{ overflow: "hidden" }}>
          <MapContainer
            center={
              areaList.length === 0
                ? [41.442, -0.5432]
                : areaList!![0].geoLocation
            }
            zoom={11}
            scrollWheelZoom={false}
          >
            <TileLayer
              maxZoom={13}
              minZoom={7}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {areaList?.map((area) => (
              <MyMarker
                key={area.id}
                eventHandlers={{
                  click: () => navigation("/area"),
                }}
                icon={
                  new Icon({
                    iconUrl: require("../../../../../app/assets/images/marker-icon.png"),
                    iconSize: [41, 41],
                    popupAnchor: [1, -25],
                  })
                }
                position={area.geoLocation}
              >
                <Popup autoClose={false}>
                  <p>{area.name}</p>
                </Popup>
              </MyMarker>
            ))}
          </MapContainer>
          <div
            className="badge-image-field"
            onClick={() => setShowList(!showList)}
          >
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width={21}
              height={30}
              style={{ fill: "rgb(62, 62, 62)" }}
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path d="M0,53.328V160h106.672V53.328H0z M90.672,144H16V69.328h74.672V144z" />
                </g>
              </g>
              <g>
                <g>
                  <path d="M0,202.672v106.672h106.672V202.672H0z M90.672,293.328H16v-74.672h74.672V293.328z" />
                </g>
              </g>
              <g>
                <g>
                  <path d="M0,352v106.672h106.672V352H0z M90.672,442.672H16V368h74.672V442.672z" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="77.344" width="320" height="16" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="120" width="362.672" height="16" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="226.672" width="320" height="16" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="269.344" width="362.672" height="16" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="376" width="320" height="16" />
                </g>
              </g>
              <g>
                <g>
                  <rect x="149.328" y="418.72" width="362.672" height="16" />
                </g>
              </g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
            </svg>
          </div>
        </div>
        <GeoList areaList={areaList} showList={showList} />
      </div>
    </>
  );
};
