import { FieldProfile } from "../../../../core/Domain";

type Props = {
  fieldProfile: FieldProfile;
};

export const FieldPopUp = ({ fieldProfile }: Props) => {
  return (
    <div>
      <img width={"100%"} src={fieldProfile.imageUrl} alt="field" />
      <p className="text-sm">{fieldProfile.name}</p>
    </div>
  );
};
