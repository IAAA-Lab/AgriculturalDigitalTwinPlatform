import { useEffect, useState } from "react";
import { areaUseCases } from "../../../../app/config/configuration";
import { AnalysisCards } from "../sections/AnalysisCards";
import { AreaMap } from "../sections/AreaMap";
import { FeaturesSection } from "../sections/FeaturesSection";
import { PlantList } from "../sections/PlantList";

export const Area = () => {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    areaUseCases.getAreasByUser("userId").then((data) => {
      setAreas(data);
    });
  }, []);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <AreaMap />
        <FeaturesSection features={[]} />
        <PlantList />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <AnalysisCards />
      </div>
    </div>
  );
};
