import { Typography, useTheme, Box } from "@mui/material";
import { Link } from "react-router-dom";

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
          <Link to="/">
            <img
              src="/static/images/overview/logo-light.svg"
              width={100}
              onClick={() => window.scrollTo(0, 0)}
            />
          </Link>
          <Typography variant="subtitle1" sx={{ color: "white" }}>
            &copy; 2022 - GEDEFEC
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Footer;
