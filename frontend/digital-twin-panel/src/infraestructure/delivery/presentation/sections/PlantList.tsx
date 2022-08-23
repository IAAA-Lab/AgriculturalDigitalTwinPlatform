import { IMAGES_URL } from "../../../../app/config/constants";
import { Crop } from "../../../../core/Domain";

type CropListProps = {
  plants?: Crop[];
};

export const CropList = ({ plants }: CropListProps) => {
  return (
    <div className="card-plants">
      {plants?.map((plant, index) => (
        <div key={index} className="card-plant">
          <div className="card-plant-header">
            <img src={`${IMAGES_URL}/crops/${plant.imageUri}`} />
            <h6 className="m-0 title">{plant.name}</h6>
            <b className="text-xs m-0 subtitle" style={{ color: "gray" }}>
              {plant.variety}
            </b>
          </div>
          <div className="vertical-divider" />
          <div className="card-plant-content">
            <div className="card-plant-content-row">
              <i className="fi fi-rs-cursor-text-alt"></i>
              <span className="text-xs">{plant.area}</span>
              <span className="text-xxs">Ha</span>
            </div>
            <div className="card-plant-content-row">
              <i className="fi fi-rs-tractor"></i>
              <span className="text-xs">{plant.production}</span>
              <span className="text-xxs">Kg</span>
            </div>
            <div className="card-plant-content-row">
              <i className="fi fi-rs-chart-histogram"></i>
              <span className="text-xs">{plant.performance}</span>
              <span className="text-xxs">Kg/Ha</span>
            </div>
            <div className="row">
              <i className="fi fi-rs-hand-holding-seeding"></i>
              <p className="text-xs m-0 ml-8">x {plant.harvest}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
