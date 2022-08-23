import { Container, Typography } from "@mui/material";
import { newsService } from "api/news";
import SuspenseLoader from "components/SuspenseLoader";
import Footer from "content/applications/Overview/Footer";
import Status500 from "content/pages/Status/Status500";
import { DEFAULT_NEWS_IMAGE, NEWS_UPLOAD_URI } from "contexts/contants";
import HTMLReactParser from "html-react-parser";
import { Result } from "models/auth";
import { News } from "models/news";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import NewsHeader from "./NewsHeader";

const SingleNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState<Result<News> | undefined>();

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    if (!id) return;
    const _news = await newsService.fetchOneNew(id);
    setNews(_news);
  };

  if (!news) {
    return <SuspenseLoader />;
  }

  if (news.isError) {
    return <Status500 />;
  }

  return (
    <>
      <Helmet>
        <title>Noticias - Panel de noticias</title>
      </Helmet>
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <NewsHeader
          author={news.data.author}
          date={news.data.date}
          readTime={news.data.readTime}
        />
        <Typography
          variant="h1"
          component="h1"
          sx={{ mt: 1, mb: 1.5, wordBreak: "break-word" }}
        >
          <b>{news.data.title}</b>
        </Typography>
        <Typography component="p" variant="subtitle2" sx={{ mb: 2 }}>
          {news.data.subtitle}
        </Typography>
        <img
          src={`${NEWS_UPLOAD_URI}/${news.data.thumbnail}`}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_NEWS_IMAGE;
          }}
          width="100%"
          style={{
            borderRadius: 6,
          }}
        />
        <Typography
          component="p"
          variant="body2"
          sx={{ fontSize: 18, mt: 3, mb: 8 }}
        >
          {news && HTMLReactParser(news?.data.content ?? "")}
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default SingleNews;
