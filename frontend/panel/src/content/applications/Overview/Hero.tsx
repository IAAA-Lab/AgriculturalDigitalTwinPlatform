import {
  Container,
  Typography,
  useTheme,
  Link,
  Box,
  styled,
  Grid,
} from "@mui/material";
import { Twitter } from "@mui/icons-material";

const Hero = () => {
  const theme = useTheme();

  const HeroWrapper = styled(Box)(
    () => `
            background-image: url(
          "/static/images/overview/Untitled.svg"
        );
        background-repeat: no-repeat;
        background-size: cover;
        background-position:right top;
        height: 100vh;
        display: flex;
        align-items: center;
        @media screen and (max-width: 699px) {
          height: auto;
          margin-top: 100px;
        }
`
  );

  const TypographyH1Colored = ({ children }: any) => {
    return (
      <Typography
        variant="h1"
        style={{
          color: theme.colors.primary.dark,
          display: "inline",
        }}
      >
        {children}
      </Typography>
    );
  };

  return (
    <HeroWrapper component="div">
      <Container
        maxWidth="xl"
        sx={{
          pt: 1,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container alignItems="center" justifyContent="center">
          <Grid item md={5}>
            <Typography
              variant="h2"
              sx={{
                pb: 2,
                color: theme.colors.primary.dark,
              }}
              className="reveal-from-left-animation"
            >
              GEDEFEC
            </Typography>
            <Typography variant="h1" className="reveal-from-right-animation">
              <TypographyH1Colored>GE</TypographyH1Colored>
              melo <TypographyH1Colored>D</TypographyH1Colored>igital para{" "}
              <TypographyH1Colored>E</TypographyH1Colored>xplotaciones de{" "}
              <TypographyH1Colored>F</TypographyH1Colored>rutos s
              <TypographyH1Colored>E</TypographyH1Colored>cos de{" "}
              <TypographyH1Colored>C</TypographyH1Colored>áscara
            </Typography>
            <Typography
              variant="h3"
              component="h3"
              sx={{ fontWeight: 500, pt: 4 }}
              className="reveal-from-left-animation"
            >
              El objetivo del proyecto es desarrollar una propuesta de gemelo
              digital para un tipo concreto de explotación agraria: frutos secos
              de cáscara.
            </Typography>
          </Grid>
          <Grid
            item
            md={5}
            sx={{
              backgroundImage: `url("/static/images/overview/neon.svg")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
            className="-animation"
          >
            <img
              style={{
                width: 350,
                maxWidth: "100%",
                WebkitFilter: "drop-shadow(4px 5px 3px grey)",
                filter: "drop-shadow(4px 5px 3px grey)",
              }}
              src="/static/images/overview/hero-almond.webp"
            />
          </Grid>
        </Grid>
      </Container>
    </HeroWrapper>
  );
};

export default Hero;
