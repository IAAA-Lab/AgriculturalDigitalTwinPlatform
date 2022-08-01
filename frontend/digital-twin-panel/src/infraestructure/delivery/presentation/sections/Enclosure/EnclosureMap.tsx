import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { Enclosure } from "../../../../../core/Domain";
import Skeleton from "react-loading-skeleton";
import { getColorList } from "../../../PortsImpl";
import { useState } from "react";
import classNames from "classnames";
import { LatLngBounds } from "leaflet";
import { RecenterButton } from "../../components/RecenterButton";

type Props = {
  enclosure?: Enclosure;
};

export const EnclosureMap = ({ enclosure }: Props) => {
  const [layers, setLayers] = useState(false);
  enum layerNames {
    MAP = "mapa",
    PHOTO = "foto",
  }
  const [selectedLayer, setSelectedLayer] = useState(layerNames.MAP);

  const classNameSelect = classNames(
    "badge-layers-options",
    layers && "active"
  );

  if (!enclosure) {
    return (
      <div className="leaflet-wrapper mb-8">
        <Skeleton height={"100%"} width={1000} />
      </div>
    );
  }

  const mapColor = getColorList(1)[0];
  const totalCoords = enclosure.current.info.coordinates.map((c) => [
    c.lat,
    c.lng,
  ]);

  const map = (
    <MapContainer
      bounds={new LatLngBounds(totalCoords as any)}
      boundsOptions={{
        padding: [50, 50],
      }}
      zoom={16}
      minZoom={11}
      maxZoom={18}
      scrollWheelZoom={false}
    >
      <TileLayer
        maxZoom={18}
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <Polyline
        positions={enclosure.current.info.coordinates}
        fill={true}
        fillOpacity={0.4}
        color={mapColor}
        weight={3}
        opacity={0.8}
      />
      <RecenterButton coords={totalCoords} />
    </MapContainer>
  );

  const photo = (
    <img src={enclosure.imageUri} alt={`enclosure ${enclosure.id}`} />
  );

  const selectedLayerFunc = () => {
    switch (selectedLayer) {
      case layerNames.PHOTO:
        return photo;
      case layerNames.MAP:
        return map;
    }
  };

  return (
    <div className="leaflet-wrapper">
      <div className="badge-wrapper" style={{ overflow: "hidden" }}>
        <div
          className="badge-layers"
          onMouseOver={() => setLayers(true)}
          onMouseLeave={() => setLayers(false)}
        >
          <img
            src={
              require("../../../../../app/assets/images/icons/layers-icon.svg")
                .default
            }
          />
        </div>
        {selectedLayerFunc()}
        <select
          className={classNameSelect}
          size={2}
          onMouseOver={() => setLayers(true)}
          onMouseLeave={() => setLayers(false)}
          onChange={(e) => {
            setSelectedLayer(e.currentTarget.value as layerNames);
          }}
        >
          <option value={layerNames.PHOTO}>{layerNames.PHOTO}</option>
          <option value={layerNames.MAP}>{layerNames.MAP}</option>
        </select>
      </div>
    </div>
  );
};
