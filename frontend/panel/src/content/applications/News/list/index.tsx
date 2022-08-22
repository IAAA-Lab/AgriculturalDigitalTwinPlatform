import {
  alpha,
  Box,
  Card,
  Container,
  Grid,
  styled,
  TablePagination,
  Typography,
} from "@mui/material";
import { newsService } from "api/news";
import SuspenseLoader from "components/SuspenseLoader";
import Footer from "content/applications/Overview/Footer";
import Status500 from "content/pages/Status/Status500";
import { getFormattedDate } from "content/utils";
import { DEFAULT_NEWS_IMAGE, NEWS_UPLOAD_URI } from "contexts/contants";
import OverviewLayout from "layouts/OverviewLayout";
import { Result } from "models/auth";

import { News } from "models/news";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CardSt = styled(Card)(
  ({ theme }) => `
  padding: ${theme.spacing(1)}; 
  transition: all ease-in-out 0.2s;
  background: ${alpha("#ffffff", 0.5)};

  &:hover {
    opacity: 0.8;
    transform: scale(1.04)
  } 
  img {
    aspect-ratio: 16/9;
    object-fit: cover;
    width: 100%;
    border-radius: 6px;
  }
    `
);

const DateSt = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.primary.dark}
`
);

const NewsList = () => {
  const [news, setNews] = useState<Result<News[]> | undefined>();
  const [numNews, setNumNews] = useState<Result<number> | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadInfo();
  }, [page]);

  const loadInfo = async () => {
    setNews(undefined);
    setNumNews(undefined);
    const resN = await newsService.fetchNumberOfNews();
    setNumNews(resN);
    const resM = await newsService.fetchAllNews(page);
    setNews(resM);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  if (!news || !numNews) {
    return <SuspenseLoader />;
  }

  if (news.isError || numNews.isError) {
    return <Status500 />;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Helmet>Noticias - GEDEFEC</Helmet>
        <Grid container spacing={5} mt={5}>
          {news.data.map(
            ({ id, title, subtitle, date, author, thumbnail, readTime }) => (
              <Grid
                item
                md={4}
                key={id}
                justifyContent="center"
                sx={{ borderRadius: 6 }}
              >
                <Link to={`/news/${id}`} style={{ textDecoration: "none" }}>
                  <CardSt>
                    <img
                      src={`${NEWS_UPLOAD_URI}/${thumbnail}`}
                      placeholder={DEFAULT_NEWS_IMAGE}
                      alt={title}
                      loading="lazy"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_NEWS_IMAGE;
                      }}
                    />
                    <Typography variant="h3">
                      <b>{title}</b>
                    </Typography>
                    <Typography component="p" variant="body1">
                      {author}
                    </Typography>
                    <DateSt variant="body1">
                      {getFormattedDate(date)} · {readTime} min lectura
                    </DateSt>
                    <Typography
                      component="p"
                      variant="subtitle2"
                      sx={{ fontSize: 18 }}
                    >
                      {subtitle}
                    </Typography>
                  </CardSt>
                </Link>
              </Grid>
            )
          )}
        </Grid>
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card>
            <TablePagination
              component="div"
              count={numNews.data}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={6}
              rowsPerPageOptions={[]}
              labelRowsPerPage=""
              style={{ paddingLeft: 15, paddingRight: 10 }}
            />
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default NewsList;
