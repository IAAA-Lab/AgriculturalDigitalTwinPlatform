import { AreaMap } from "../sections/Parcel/ParcelMap";
import { PlantList } from "../sections/PlantList";
import { Enclosure, Features } from "../../../../core/Domain";
import { useLocation } from "react-router-dom";
import { FeaturesSection } from "../sections/FeaturesSection";
import { AreaAnalysisCards } from "../sections/Parcel/ParcelAnalysisCards";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/config/context/redux/app-store";

export const ParcelPage = () => {
  const { pathname } = useLocation();
  const parcels = useSelector((state: RootState) => state.terrain?.parcels);

  if (parcels?.isError) {
    return <></>;
  }

  const parcelId = pathname.split("/").pop();
  const parcel = parcels?.data.find((e) => e.id === parcelId);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <AreaMap enclosures={parcel?.current.enclosures} />
        <FeaturesSection features={parcel?.current.commons} />
        <PlantList />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <AreaAnalysisCards data={parcel?.current.enclosures} />
      </div>
    </div>
  );
};
