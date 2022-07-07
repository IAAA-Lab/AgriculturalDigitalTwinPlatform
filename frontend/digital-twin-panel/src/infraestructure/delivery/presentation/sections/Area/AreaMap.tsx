import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { fieldUseCases } from "../../../../../app/config/configuration";
import { getRandomColor } from "../../../PortsImpl";
import { FieldPopUp } from "../../components/FieldPopUp";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field } from "../../../../../core/Domain";

type Props = {
  fieldProfileList?: Field[];
};

export const AreaMap = ({ fieldProfileList }: Props) => {
  const navigation = useNavigate();
  let { areaName } = useParams();

  return (
    <div className="leaflet-wrapper">
      <div className="badge-wrapper" style={{ overflow: "hidden" }}>
        <MapContainer
          center={[41.403505, -0.52197]}
          zoom={13}
          minZoom={11}
          maxZoom={15}
          scrollWheelZoom={false}
        >
          <TileLayer
            maxZoom={15}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {fieldProfileList?.map((field, index) => (
            <Link
              to={`/home/${areaName}/${field.fieldProfile.name}`}
              key={index}
            >
              <Polyline
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  click: (_) => {
                    navigation(`/home/${areaName}/${field.fieldProfile.name}`);
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
