import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { fieldUseCases } from "../../../../app/config/configuration";
import { getRandomColor } from "../../PortsImpl";
import { FieldPopUp } from "../components/FieldPopUp";
import { Link, useNavigate } from "react-router-dom";

export const AreaMap = () => {
  const navigation = useNavigate();
  const [fields, setFields] = useState<FieldProfile[]>([]);

  useEffect(() => {
    fieldUseCases.getAllFieldsInArea("1").then((data) => {
      setFields(data);
    });
  }, []);

  return (
    <MapContainer
      center={[41.403505, -0.52197]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        maxZoom={15}
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {fields.map((field, index) => (
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
            positions={field.geoBoundaries}
            fill={true}
            fillOpacity={0.4}
            color={getRandomColor()}
            weight={3}
            opacity={0.8}
          >
            <Popup>
              <FieldPopUp fieldProfile={field} />
            </Popup>
          </Polyline>
        </Link>
      ))}
    </MapContainer>
  );
};
