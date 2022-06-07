type Props = {
  features: FieldCharacteristics[];
};

export const FeaturesSection = ({ features }: Props) => {
  const featuresList = features.map(({ name, value, unit }, index) => (
    <div className="card-tiles-item" key={index}>
      <div className="card-features">
        <div className="col">
          <p className="text-xs m-0">{name}</p>
          <div className="row">
            <h3 className="m-0">{value}</h3>
            <p className="text-xxs m-0 ml-8">{unit}</p>
          </div>
        </div>
      </div>
    </div>
  ));

  return <div className="card-tiles">{featuresList}</div>;
};
