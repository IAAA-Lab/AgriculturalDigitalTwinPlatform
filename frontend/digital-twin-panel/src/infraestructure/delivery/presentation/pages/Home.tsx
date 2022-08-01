import { HomeAnalysisCards } from "../sections/Home/HomeAnalysisCards";
import { FeaturesSection } from "../sections/FeaturesSection";
import { HomeMap } from "../sections/Home/HomeMap";
import { PlantList } from "../sections/PlantList";
import { RootState } from "../../../../app/config/context/redux/app-store";
import { useSelector } from "react-redux";
import { ErrorPage } from "./ErrorPage";

export const Home = () => {
  const terrain = useSelector((state: RootState) => state.terrain);

  if (terrain?.parcels?.isError) {
    return <ErrorPage />;
  }

  return (
    <div className="site-inner-content">
      <div className="site-quadrant-left">
        <HomeMap parcelList={terrain?.parcels} />
        <FeaturesSection features={terrain?.commons} />
        <PlantList />
        <br />
      </div>
      <div className="vertical-site-separator" />
      <div className="site-quadrant-right">
        <HomeAnalysisCards data={terrain?.parcels} />
      </div>
    </div>
  );
};
