import { Icon } from "leaflet";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";

export const HomeMap = () => {
  const navigation = useNavigate();

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
      <Marker
        eventHandlers={{
          mouseover: (e) => {
            e.target.openPopup();
          },
          mouseout: (e) => {
            e.target.closePopup();
          },
          click: (e) => {
            navigation("/area");
          },
        }}
        icon={
          new Icon({
            iconUrl: require("../../../../app/assets/images/marker-icon.png"),
            iconSize: [41, 41],
            popupAnchor: [1, -25],
          })
        }
        riseOnHover
        position={[41.403505, -0.52197]}
      >
        <Popup>Zona 1</Popup>
      </Marker>
    </MapContainer>
  );
};
