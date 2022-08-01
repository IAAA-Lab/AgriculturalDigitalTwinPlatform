type Props = {
  name: string;
  imageUri: string;
};

export const EnclosureToolTipContent = ({ name, imageUri }: Props) => {
  return (
    <>
      <img className="has-shadow" width={"100%"} src={imageUri} alt="field" />
      <p className="text-sm">{name}</p>
    </>
  );
};
