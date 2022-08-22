import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { NavLink as RouterLink } from "react-router-dom";

const PageHeader = () => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Noticias
        </Typography>
        <Typography variant="subtitle2">
          Las noticias activas en la base de datos
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          component={RouterLink}
          to="/management/news/manage"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Añadir noticia
        </Button>
      </Grid>
    </Grid>
  );
};

export default PageHeader;
