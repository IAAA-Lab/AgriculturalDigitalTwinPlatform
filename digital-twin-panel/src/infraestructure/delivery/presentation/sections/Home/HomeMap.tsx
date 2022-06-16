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

  if (areaList === undefined) return null;

  return (
    <>
      <div className="leaflet-wrapper">
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
              <Popup autoClose={false} keepInView>
                <p>{area.name}</p>
              </Popup>
            </MyMarker>
          ))}
        </MapContainer>
        <GeoList areaList={areaList} />
      </div>
      <button
        onClick={() => {
          const map = document.getElementsByClassName("geo-list").item(0);
          showList
            ? map?.classList.remove("is-closed")
            : map?.classList.add("is-closed");
          setShowList(!showList);
        }}
      >
        click
      </button>
    </>
  );
};
