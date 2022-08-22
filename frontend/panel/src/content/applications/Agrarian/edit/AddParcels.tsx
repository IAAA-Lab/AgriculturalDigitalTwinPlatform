import { Add, Cancel, Done } from "@mui/icons-material";
import {
  TableRow,
  TableCell,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import { id } from "date-fns/locale";
import { Parcel } from "models/parcel";
import { useEffect, useState } from "react";

type AddParcelsProps = {
  onAddParcel: (parcel?: Parcel) => void;
  parcel?: Parcel;
};

const AddParcels = ({ onAddParcel, parcel }: AddParcelsProps) => {
  const [newEnclosures, setNewEnclosures] = useState<string[]>([]);
  const [newParcel, setNewParcel] = useState<Parcel | undefined>(parcel);

  const handleAddParcel = async () => {
    if (!newParcel || checkError()) return;
    onAddParcel(newParcel);
    setNewParcel(undefined);
  };

  const handleRevert = () => {
    onAddParcel(undefined);
    setNewParcel(undefined);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _enclosures = e.target.value.split(",");
    setNewEnclosures(_enclosures);
    setNewParcel({
      id: _enclosures[0]
        .split("-")
        .filter((_, i, a) => i != a.length - 1)
        .join("-"),
      enclosures: { ids: _enclosures },
    });
  };

  const checkError = (): boolean => {
    const lenght = newEnclosures.length === 0;
    const regexp =
      RegExp(/^((([0-9]+)-){6}[0-9]+,)*((([0-9]+)-){6}[0-9]+)+$/).test(
        newEnclosures.join(",")
      ) === false;

    const sameParcelId =
      newEnclosures.filter(
        (id) =>
          id
            .split("-")
            .filter((_, i, a) => i != a.length - 1)
            .join("-") !== newParcel?.id
      ).length > 0;
    const noDuplicates = new Set(newEnclosures).size !== newEnclosures.length;
    return lenght || regexp || sameParcelId || noDuplicates;
  };

  const theme = useTheme();

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body1" color="text.primary">
          <b>{newParcel?.id}</b>
        </Typography>
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          label="Agregar ids de recintos"
          fullWidth
          defaultValue={parcel?.enclosures.ids?.join(",")}
          error={checkError()}
          onChange={onChange}
        />
      </TableCell>
      <TableCell align="right">
        {parcel && (
          <IconButton
            sx={{
              "&:hover": { background: theme.colors.error.lighter },
              color: theme.palette.error.main,
            }}
            color="inherit"
            size="small"
            onClick={handleRevert}
          >
            <Cancel />
          </IconButton>
        )}
        <IconButton
          sx={{
            "&:hover": { background: theme.colors.success.lighter },
            color: theme.palette.success.main,
          }}
          color="inherit"
          size="small"
          onClick={handleAddParcel}
        >
          {!parcel ? (
            <Add sx={{ width: 30, height: 30 }} fontSize="small" />
          ) : (
            <Done />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export default AddParcels;
