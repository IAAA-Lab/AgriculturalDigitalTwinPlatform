import { useEffect, useState } from "react";
import { fieldUseCases } from "../../../../app/config/configuration";
import { HomeAnalysisCards } from "../sections/HomeAnalysisCards";
import { AreaMap } from "../sections/Area/AreaMap";
import { FeaturesSection } from "../sections/FeaturesSection";
import { PlantList } from "../sections/PlantList";
import { FieldsPerArea } from "../../../../core/Domain";

export const Area = () => {
  const [fields, setFields] = useState<FieldsPerArea>();

  useEffect(() => {
    fieldUseCases.getAllFieldsInArea("1").then((data) => setFields(data));
  }, []);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <AreaMap fieldProfileList={fields?.fields} />
        <FeaturesSection features={fields?.features.characteristics} />
        <PlantList />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <HomeAnalysisCards />
      </div>
    </div>
  );
};
