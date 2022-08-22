import { Done } from "@mui/icons-material";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import EditTwoTone from "@mui/icons-material/EditTwoTone";
import {
  TableCell,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  TableRow,
  useTheme,
  TextField,
} from "@mui/material";
import { Parcel } from "models/parcel";
import { useState } from "react";

type ParcelsRowProps = {
  parcel: Parcel;
  handleRemoveEnclosure: any;
  handleRemoveParcel: any;
  editParcel: any;
};

const ParcelsRow = ({
  parcel,
  handleRemoveEnclosure,
  handleRemoveParcel,
  editParcel,
}: ParcelsRowProps) => {
  const theme = useTheme();

  return (
    <TableRow hover key={parcel.id}>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {parcel.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" fontWeight="bold" color="text.primary">
          {parcel.enclosures.ids.map((id, index) => (
            <Chip
              label={id}
              key={id}
              onDelete={() => handleRemoveEnclosure(parcel, index)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar parcela" arrow>
          <IconButton
            sx={{
              "&:hover": {
                background: theme.colors.primary.lighter,
              },
              color: theme.palette.primary.main,
            }}
            color="inherit"
            size="small"
            onClick={() => editParcel(parcel)}
          >
            <EditTwoTone fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Borrar parcela" arrow>
          <IconButton
            sx={{
              "&:hover": { background: theme.colors.error.lighter },
              color: theme.palette.error.main,
            }}
            color="inherit"
            size="small"
            onClick={() => handleRemoveParcel(parcel)}
          >
            <DeleteTwoTone fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ParcelsRow;
