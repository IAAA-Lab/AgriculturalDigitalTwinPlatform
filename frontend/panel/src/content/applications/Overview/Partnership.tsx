import {
  alpha,
  Box,
  Container,
  Divider,
  Grid,
  styled,
  Typography,
} from "@mui/material";

const Partnership = () => {
  const MuiAvatar = styled(Box)(
    ({ theme }) => `
    width: 175px;
    height: 175px;
    border-radius: ${theme.general.borderRadius};
    background-color: ${alpha(theme.colors.secondary.light, 0.15)};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};
    img {
      width: 150px;
      display: block;
    }
    &:hover {
       transition: box-shadow 0.1s ease-in-out !important;
        box-shadow: 0 6px 10px rgba(0,0,0, 0.2);
    }
`
  );

  const logosPath = [
    {
      path: "/static/images/overview/virtalis-logo.png",
      link: "https://www.vitartis.es/",
    },
    {
      path: "/static/images/overview/7edata-logo.png",
      link: "https://www.7edata.com/",
    },
    {
      path: "/static/images/overview/agrointelligent-logo.webp",
      link: "https://www.agrointelligent.com/",
    },
    {
      path: "/static/images/overview/geoslab-logo.png",
      link: "https://www.geoslab.com/",
    },
    {
      path: "/static/images/overview/campg-logo.png",
      link: "https://campag.es/",
    },
    {
      path: "/static/images/overview/pystacil-logo.png",
      link: "https://pistacyl.com/",
    },
    {
      path: "/static/images/overview/cetemet-logo.png",
      link: "https://cetemet.es/",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Divider
          variant="middle"
          sx={{ height: 2, m: 10, backgroundColor: "#A1A1A1" }}
        />
        <Typography variant="h1">Socios</Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ fontSize: 20, mt: 2 }}
        >
          El consorcio que lleva a cabo el proyecto está formado por un total de
          siete entidades: dos clústers, un centro tecnológico, dos pymes y una
          startup de base tecnológica y una empresa agroalimentaria.
        </Typography>
      </Container>
      <Grid
        container
        spacing={1}
        mt={5}
        alignItems="top"
        justifyContent="center"
      >
        {logosPath.map(({ path, link }) => (
          <Grid item md={3} key={path}>
            <a href={link}>
              <MuiAvatar className="reveal-from-bottom-animation">
                <img src={path} width={200} />
              </MuiAvatar>
            </a>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Partnership;
