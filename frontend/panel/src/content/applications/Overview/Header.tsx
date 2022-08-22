import { LoginRounded } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Grid,
  Hidden,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Container } from "@mui/system";
import Logo from "components/LogoSign";
import { Link, NavLink as RouterLink } from "react-router-dom";
import HeaderUserbox from "./HeaderUserBox";

const HeaderC = () => {
  const HeaderWrapper = styled(Box)(
    ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        right: 0;
        z-index: 6;
        backdrop-filter: blur(5px);
        background: ${alpha(theme.palette.background.default, 0.7)};
        position: fixed;
        width: 100%;
`
  );

  return (
    <HeaderWrapper display="flex" alignItems="center" flexWrap="nowrap">
      <Container
        component="div"
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        style={{ justifyContent: "space-between" }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Grid
            flexWrap="nowrap"
            container
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Logo light={false} />
            <Hidden mdDown>
              <Typography variant="h3" sx={{ fontSize: 18 }}>
                GEDEFEC
              </Typography>
            </Hidden>
          </Grid>
        </Link>
        <Box sx={{ mr: 0 }}>
          <Grid
            container
            spacing={4}
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
          >
            <Hidden mdDown>
              <Grid item>
                <Button variant="outlined" component={RouterLink} to="/news">
                  Noticias
                </Button>
              </Grid>
            </Hidden>
            <Grid item>
              <HeaderUserbox />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </HeaderWrapper>
  );
};

export default HeaderC;
