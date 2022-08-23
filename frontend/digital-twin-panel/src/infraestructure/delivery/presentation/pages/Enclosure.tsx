import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../../app/config/context/redux/app-store";
import { EnclosureAnalysisCards } from "../sections/Enclosure/EnclosureAnalysisCards";
import { EnclosureMap } from "../sections/Enclosure/EnclosureMap";
import { FeaturesSection } from "../sections/FeaturesSection";
import { CropList } from "../sections/PlantList";

export const EnclosurePage = () => {
  const { pathname } = useLocation();
  const parcels = useSelector((state: RootState) => state.terrain?.parcels);

  if (parcels?.isError) {
    return <></>;
  }

  const enclosureId = pathname.split("/").pop();
  const parcelId = pathname.split("/").reverse()[1];

  const enclosure = parcels?.data
    .find((e) => e.id === parcelId)
    ?.current.enclosures.find((f) => f.id === enclosureId);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <EnclosureMap enclosure={enclosure} />
        <FeaturesSection features={enclosure?.current.info.characteristics} />
        <CropList plants={enclosure?.current.info.crops} />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <EnclosureAnalysisCards data={enclosure} />
      </div>
    </div>
  );
};
