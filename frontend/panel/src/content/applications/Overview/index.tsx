import { Height, Login, LoginRounded } from "@mui/icons-material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import OverviewLayout from "layouts/OverviewLayout";
import ScrollReveal from "layouts/ScrollReveal";
import { Helmet } from "react-helmet-async";
import FeaturesSplit from "./FeaturesSplit";
import FeatureTiles from "./FeatureTiles";
import Financing from "./Financing";
import Footer from "./Footer";
import HeaderC from "./Header";
import Hero from "./Hero";
import Partnership from "./Partnership";
import Testimonial from "./Testimonial";

const Overview = () => {
  const OverviewWrapper = styled(Box)(
    ({ theme }) => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
    color: #2E2E2E;
    line-height: 1;
    h1 {
        font-size: ${theme.typography.pxToRem(52)};
        word-break: break-word;
        font-weight: bold;
    }
    h3 {
      font-size: ${theme.typography.pxToRem(20)};
        word-break: break-word;
    }
    @media screen and (max-width: 699px) {
      text-align: center;
      h1 {
        font-size: ${theme.typography.pxToRem(30)};
      }
      h2 {
        font-size: 20px;
        font-weight: bold;
      }
      h3 {
      font-size: ${theme.typography.pxToRem(18)};
    }
      p {
        font-size: 17px;
      }
    }
`
  );

  return (
    <OverviewWrapper>
      <Helmet>
        <title>Página de inicio · GEDEFEC</title>
      </Helmet>
      <ScrollReveal>
        <Hero />
        <FeatureTiles />
        <FeaturesSplit />
        <Partnership />
        <Financing />
        <Testimonial />
        <Footer />
      </ScrollReveal>
    </OverviewWrapper>
  );
};

export default Overview;
