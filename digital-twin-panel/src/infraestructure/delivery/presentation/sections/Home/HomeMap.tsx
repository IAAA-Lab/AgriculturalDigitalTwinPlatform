import { Icon } from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { GeoList } from "./AreaGeoList";

type Props = {
  areaList?: Area[];
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
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            maxZoom={13}
            minZoom={7}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {areaList?.map((area) => (
            <Marker
              key={area.id}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
                click: (_) => navigation("/area"),
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
              <Popup>
                <p>{area.name}</p>
              </Popup>
            </Marker>
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
