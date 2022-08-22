import {
  styled,
  Typography,
  Divider,
  Container,
  Box,
  Grid,
} from "@mui/material";

const FeaturesSplit = () => {
  const FaseText = styled(Typography)(
    ({ theme }) => `
        color: ${theme.colors.primary.main};
        font-weight: bold;
        margin-bottom: ${theme.spacing(1)};
    `
  );

  const OrderedGrid = styled(Grid)<{ porder: number }>`
    @media screen and (max-width: 699px) {
      order: ${(p) => p.porder};
    }
  `;

  const Image = styled(Box)(
    () => `
        img {
    border-radius: 5px;
    max-width: 100%;
    width: 528px;
    height: 350px;
    border: 2px solid gray;
    box-shadow: 0 15px 30px rgba(0,0,0, 0.6);
        }
    @media screen and (max-width: 699px) {
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 4 / 3;
      }
    }
    `
  );

  return (
    <Box
      style={{
        backgroundImage: `url(
          "/static/images/overview/illustration-section-02.svg"
        )`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "200px 50px",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
          <Divider
            variant="middle"
            sx={{ height: 2, m: 10, backgroundColor: "#A1A1A1" }}
          />
          <Typography variant="h1">Conociendo la tecnología</Typography>
          <Typography
            component="p"
            variant="subtitle2"
            sx={{
              fontSize: 20,
              mt: 2,
            }}
          >
            El concepto de gemelo digital en agricultura está muy poco
            consolidado debido, especialmente, a la gran complejidad de
            discretizar una realidad basada en “elementos” vivos (una planta o
            un animal o un conjunto de ellos…) y con unos ámbitos temporales
            (plantas con periodos de vida de un año frente a plantas con
            periodos de vida de cientos de años …) y espaciales (pequeña
            explotaciones frente a otras de mayor tamaño), tan heterogéneos y
            complejos.
          </Typography>
        </Container>
        <Grid
          container
          columnSpacing={5}
          mt={1}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item md={5} mt={8} order={1}>
            <FaseText className="reveal-from-left-animation">FASE 1</FaseText>
            <Typography variant="h2" className="reveal-from-left-animation">
              Modelo e identificación de datos
            </Typography>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{ fontSize: 18, mt: 2 }}
              className="reveal-from-left-animation"
            >
              Obtener un modelo de datos que sustente el desarrollo del gemelo
              digital. Para ello, se identificarán y caracterizarán las
              variables que son relevantes en los cultivos de frutos de cáscara,
              así como la relación entre ellas.
            </Typography>
          </Grid>
          <Grid item md={5} mt={8} order={2}>
            <Image className="reveal-from-right-animation">
              <img
                width={540}
                style={{ objectFit: "cover" }}
                src="/static/images/overview/fase_1_1.jpg"
              />
            </Image>
          </Grid>
          <OrderedGrid item md={5} mt={8} order={3} porder={4}>
            <Image className="reveal-from-left-animation">
              <img
                width={540}
                style={{ objectFit: "cover" }}
                src="/static/images/overview/fase_1_2.webp"
              />
            </Image>
          </OrderedGrid>
          <OrderedGrid item md={5} mt={8} order={4} porder={3}>
            <FaseText className="reveal-from-right-animation">FASE 1</FaseText>
            <Typography variant="h2" className="reveal-from-right-animation">
              Funcionalidades
            </Typography>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{ fontSize: 18, mt: 2 }}
              className="reveal-from-right-animation"
            >
              Especificar las funcionalidades que debe tener el gemelo digital.
            </Typography>
          </OrderedGrid>
          <Grid item md={5} mt={8} order={5}>
            <FaseText className="reveal-from-left-animation">FASE 1</FaseText>
            <Typography variant="h2" className="reveal-from-left-animation">
              Primera implementación y demostrador
            </Typography>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{ fontSize: 18, mt: 2 }}
              className="reveal-from-left-animation"
            >
              Disponer de una primera implementación del sistema de información
              que constituye en gemelo digital. Además, contar con un primer
              demostrador alimentado con datos de una explotación real que pueda
              servir de base para el desarrollo de las siguientes fases.
            </Typography>
          </Grid>
          <Grid item md={5} mt={8} order={6}>
            <Image className="reveal-from-right-animation">
              <img
                width={550}
                style={{ objectFit: "contain", background: "#6895F7" }}
                src="/static/images/overview/fase_1_3.png"
              />
            </Image>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSplit;
