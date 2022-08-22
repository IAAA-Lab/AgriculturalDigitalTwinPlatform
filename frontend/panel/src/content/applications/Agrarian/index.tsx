import { Container, Grid } from "@mui/material";
import PageTitleWrapper from "components/PageTitleWrapper";
import { Helmet } from "react-helmet-async";
import ParcelsTable from "./ParcelsTable";

const Agrarian = () => {
  return (
    <>
      <Helmet>
        <title>Noticias - Panel agrario</title>
      </Helmet>
      <ParcelsTable />
    </>
  );
};

export default Agrarian;
