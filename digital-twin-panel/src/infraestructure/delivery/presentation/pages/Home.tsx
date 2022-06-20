import { useEffect, useState } from "react";
import { areaUseCases } from "../../../../app/config/configuration";
import { HomeAnalysisCards } from "../sections/HomeAnalysisCards";
import { FeaturesSection } from "../sections/FeaturesSection";
import { HomeMap } from "../sections/Home/HomeMap";
import { PlantList } from "../sections/PlantList";

export const Home = () => {
  const [areaList, setAreaList] = useState<AreasPerUser>();

  useEffect(() => {
    setTimeout(() => {
      areaUseCases.getAreasByUser("1").then((areas) => {
        setAreaList(areas);
      });
    }, 2000);
  }, []);

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <HomeMap areaList={areaList?.areas} />
        <FeaturesSection features={areaList?.features.characteristics} />
        <PlantList />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <HomeAnalysisCards data={areaList} />
      </div>
    </div>
  );
};
