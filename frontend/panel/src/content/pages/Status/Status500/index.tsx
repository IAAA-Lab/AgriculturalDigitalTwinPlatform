import { useState } from "react";
import {
  Box,
  Typography,
  Hidden,
  Container,
  Button,
  Grid,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import LoadingButton from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const GridWrapper = styled(Grid)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[100]};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
);

function Status500() {
  const [pending, setPending] = useState(false);
  function handleClick() {
    setPending(true);
  }

  return (
    <>
      <Helmet>
        <title>Error - 500</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="sm">
          <Box textAlign="center">
            <img
              alt="500"
              height={260}
              width="100%"
              src="/static/images/status/500.svg"
            />
            <Typography variant="h2" sx={{ my: 2 }}>
              Se produjo un error, inténtelo más tarde
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              El servidor encontró un error y no fue posible completar su
              petición
            </Typography>
            <Button href="/" variant="contained" sx={{ ml: 1 }}>
              Página de inicio
            </Button>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

export default Status500;
