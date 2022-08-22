import { Avatar, Box, styled } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

type Props = {
  light?: boolean;
};

const Logo: FC<Props> = ({ light = true }) => {
  return (
    <LogoWrapper to="/">
      <Avatar
        src={
          light
            ? "/static/images/overview/logo-light.svg"
            : "/static/images/overview/logo.svg"
        }
        sx={{
          maxWidth: "100%",
          width: 90,
          height: 90,
          margin: 0,
          padding: 0,
        }}
      />
    </LogoWrapper>
  );
};

export default Logo;
