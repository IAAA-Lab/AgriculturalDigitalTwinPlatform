import { Container, Grid } from "@mui/material";
import PageTitleWrapper from "components/PageTitleWrapper";
import { Helmet } from "react-helmet-async";
import NewsTable from "./NewsTable";

import PageHeader from "./PageHeader";

const News = () => {
  return (
    <>
      <Helmet>
        <title>Noticias - Panel de noticias</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <NewsTable />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default News;
