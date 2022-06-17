import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { fieldUseCases } from "../../../../../app/config/configuration";
import { getRandomColor } from "../../../PortsImpl";
import { FieldPopUp } from "../../components/FieldPopUp";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  fieldProfileList?: Field[];
};

export const AreaMap = ({ fieldProfileList }: Props) => {
  const navigation = useNavigate();

  return (
    <div className="leaflet-wrapper">
      <div className="badge-wrapper" style={{ overflow: "hidden" }}>
        <MapContainer
          center={[41.403505, -0.52197]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            maxZoom={15}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {fieldProfileList?.map((field, index) => (
            <Link to={"/singleField"} key={index}>
              <Polyline
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  click: (_) => {
                    navigation("/singleField");
                  },
                }}
                positions={field.fieldProfile.geoBoundaries}
                fill={true}
                fillOpacity={0.4}
                color={getRandomColor()}
                weight={3}
                opacity={0.8}
              >
                <Popup>
                  <FieldPopUp fieldProfile={field.fieldProfile} />
                </Popup>
              </Polyline>
            </Link>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
