import { Typography, Button, Grid } from "@mui/material";
import { UpdateTwoTone } from "@mui/icons-material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

type PageHeaderProps = {
  onUpdate: any;
};

const PageHeader = ({ onUpdate }: PageHeaderProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    await onUpdate();
    setLoading(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Parcelas
        </Typography>
        <Typography variant="subtitle2">
          Las parcelas por cada usuario
        </Typography>
      </Grid>
      <Grid item>
        <LoadingButton
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<UpdateTwoTone fontSize="small" />}
          onClick={onClick}
          loading={loading}
        >
          Actualizar parcelas
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default PageHeader;
