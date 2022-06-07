import { useEffect, useState } from "react";
import { fieldUseCases } from "../../../../app/config/configuration";
import { AnalysisCards } from "../sections/AnalysisCards";
import { FeaturesSection } from "../sections/FeaturesSection";
import { HomeMap } from "../sections/HomeMap";
import { PlantList } from "../sections/PlantList";

export const Home = () => {
  const [features, setFeatures] = useState<FieldCharacteristics[]>([]);

  useEffect(() => {
    fieldUseCases.getField("1").then((data) => {
      setFeatures(data.characteristics);
    });
  }, []);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <HomeMap />
        <FeaturesSection features={features} />
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
