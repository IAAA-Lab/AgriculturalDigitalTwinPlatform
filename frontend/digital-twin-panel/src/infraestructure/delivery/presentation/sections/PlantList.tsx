import { IMAGES_URL } from "../../../../app/config/constants";
import { Crop } from "../../../../core/Domain";
import { getCropIconByName } from "../../PortsImpl";

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
            {plant.characteristics.map((c, index) => (
              <div key={index} className="card-plant-content-row">
                <i className={getCropIconByName(c.name)}></i>
                <span className="text-xs">{c.value}</span>
                <span className="text-xxs">{c.unit}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
