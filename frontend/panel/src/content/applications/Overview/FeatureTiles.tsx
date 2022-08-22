import {
  Container,
  Typography,
  Box,
  Grid,
  styled,
  alpha,
  Divider,
} from "@mui/material";

const MuiAvatar = styled(Box)(
  ({ theme }) => `
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  border-radius: ${theme.general.borderRadius};
  background-color: ${alpha(theme.colors.primary.main, 0.8)};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing(2)};
  img {
    width: 100px;
    height: 100px;
    display: block;
  }
`
);

const features = [
  {
    avatar: "/static/images/overview/feature-tile-icon-01.svg",
    title: "Modelo de datos consistente",
    subtitle:
      "Obtener un modelo de datos que sustente el desarrollo del gemelo digital.",
  },
  {
    avatar: "/static/images/overview/feature-tile-icon-02.svg",
    title: "Identificación de datos",
    subtitle:
      "Identificar las fuentes de datos para cada una de las variables seleccionadas.",
  },
  {
    avatar: "/static/images/overview/feature-tile-icon-03.svg",
    title: "Funcionalidades",
    subtitle:
      "Especificar las funcionalidades que debe tener el gemelo digital.",
  },
  {
    avatar: "/static/images/overview/feature-tile-icon-04.svg",
    title: "Primera implementación",
    subtitle:
      "Disponer de una primera implementación del sistema de información que constituye en gemelo digital.",
  },
  {
    avatar: "/static/images/overview/feature-tile-icon-05.svg",
    title: "Primer desmostrador",
    subtitle:
      "Contar con un primer demostrador alimentado con datos de una explotación real que pueda servir de base para el desarrollo de las siguientes fases.",
  },
];

const FeatureTiles = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Divider
          variant="middle"
          sx={{ height: 2, m: 10, backgroundColor: "#A1A1A1" }}
        />
        <Typography variant="h1">Objetivos de la primera fase</Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ fontSize: 20, mt: 2 }}
        >
          Los gemelos digitales permiten la digitalización de la realidad física
          como elemento de base para poder aplicar técnicas de inteligencia
          artificial a grandes volúmenes de datos. El proyecto se estructura en
          tres fases. En la primera de ellas se trabajará en:
        </Typography>
      </Container>
      <Grid
        container
        rowSpacing={7}
        mt={5}
        alignItems="top"
        justifyContent="center"
      >
        {features.map(({ avatar, title, subtitle }) => (
          <Grid
            item
            md={4}
            key={title}
            className="reveal-from-bottom-animation"
          >
            <MuiAvatar>
              <img src={avatar} alt="feature-tile-icon-01" />
            </MuiAvatar>
            <Typography variant="h3">
              <Box sx={{ pb: 2 }}>
                <b>{title}</b>
              </Box>
              <Typography
                component="p"
                variant="subtitle2"
                sx={{ fontSize: 18 }}
              >
                {subtitle}
              </Typography>
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeatureTiles;
