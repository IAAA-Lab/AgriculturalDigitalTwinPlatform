import Twitter from "@mui/icons-material/Twitter";
import { Typography, Link, useTheme, styled, Box } from "@mui/material";

const Image = styled(Box)(
  `
  img {
  max-width: 100%;
  width: 400px;
  position: relative;
  padding-top: 20px;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  -web-kit-filter: drop-shadow(10px 10px 5px #222);
  filter: drop-shadow(10px 10px 5px #222);
  }
`
);
const Footer = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.colors.secondary.dark,
      }}
    >
      <Box
        pb={2}
        display={{ xs: "block", md: "flex" }}
        alignItems="center"
        textAlign={{ xs: "center", md: "left" }}
        justifyContent="space-between"
      >
        <Box>
          <img
            src="/static/images/overview/logo-light.svg"
            width={100}
            onClick={() => window.scrollTo(0, 0)}
          />
          <Typography variant="subtitle1" sx={{ color: "white" }}>
            &copy; 2022 - GEDEFEC
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Footer;
