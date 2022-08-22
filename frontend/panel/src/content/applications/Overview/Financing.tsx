import {
  Container,
  Divider,
  Typography,
  Grid,
  alpha,
  Box,
  styled,
} from "@mui/material";

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: 250px;
    height: 250px;
    border-radius: ${theme.general.borderRadius};
    background-color: ${alpha(theme.colors.secondary.light, 0.15)};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};
    img {
      width: 225px;
      display: block;
    }
`
);

const logosPath = [
  {
    path: "/static/images/overview/logo-planrecuperacion.jpg",
  },
  {
    path: "/static/images/overview/Logo-Gobierno-MINCOTUR-DGIPYME.jpg",
  },
  {
    path: "/static/images/overview/logo-AEI-cluster.jpg",
  },
  {
    path: "/static/images/overview/NExtGen.jfif",
  },
];

const Financing = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Divider
          variant="middle"
          sx={{ height: 2, m: 10, backgroundColor: "#A1A1A1" }}
        />
        <Typography variant="h1">Financiación</Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ fontSize: 20, mt: 2 }}
        >
          El proyecto GEDEFEC está apoyado por la convocatoria de octubre de
          2021, de apoyo a AAEEII del Ministerio de Industria, Comercio y
          Turismo, financiada por la Unión Europea – Next Generation EU (Nº
          Expte: AEI-010500-2021b-122).
        </Typography>
      </Container>
      <Grid
        container
        spacing={1}
        mt={5}
        alignItems="top"
        justifyContent="center"
      >
        {logosPath.map(({ path }) => (
          <Grid item md={5} key={path}>
            <MuiAvatar className="reveal-from-bottom-animation">
              <img src={path} width={200} />
            </MuiAvatar>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Financing;
