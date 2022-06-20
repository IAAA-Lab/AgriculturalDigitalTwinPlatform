import { numberWithCommas } from "../../PortsImpl";
import { FeaturesSkeleton } from "../components/FeaturesSkeleton";

type Props = {
  features?: FieldCharacteristics[];
};

export const FeaturesSection = ({ features }: Props) => {
  if (!features) {
    return <FeaturesSkeleton />;
  }

  const featuresList = features?.map(({ name, value, unit, state }, index) => (
    <div className="card-tiles-item" key={index}>
      <div className="card-features">
        <div className="col">
          <p className="text-xs tt-u fw-500 m-0">{name}</p>
          <div className="row space-between">
            <div className="row">
              <h3 className="m-0">{numberWithCommas(value)}</h3>
              <p className="text-xxs m-0 ml-8">{unit}</p>
            </div>
            <p className={`badge-state-${state} m-0 text-xxs`}>{state}</p>
          </div>
        </div>
      </div>
    </div>
  ));

  return <div className="card-tiles reveal-from-left">{featuresList}</div>;
};
