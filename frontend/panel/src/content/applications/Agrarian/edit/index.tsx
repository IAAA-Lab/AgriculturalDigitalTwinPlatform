import { Parcel } from "models/parcel";
import { useState } from "react";
import ParcelsRow from "../ParcelsRow";
import AddParcels from "./AddParcels";

type ParcelsEditProps = {
  parcel: Parcel;
  handleRemoveParcel: any;
  handleUpdateEnclosures: any;
  handleRemoveEnclosure: any;
  editParcel: any;
};

const ParcelsEdit = ({
  parcel,
  handleUpdateEnclosures,
  handleRemoveParcel,
  handleRemoveEnclosure,
}: ParcelsEditProps) => {
  const [edit, setEdit] = useState(false);

  const onEditParcel = (parcel?: Parcel) => {
    handleUpdateEnclosures(parcel);
    setEdit(!edit);
  };

  return edit ? (
    <AddParcels parcel={parcel} onAddParcel={onEditParcel} />
  ) : (
    <ParcelsRow
      parcel={parcel}
      handleRemoveEnclosure={handleRemoveEnclosure}
      handleRemoveParcel={handleRemoveParcel}
      editParcel={onEditParcel}
    />
  );
};

export default ParcelsEdit;
