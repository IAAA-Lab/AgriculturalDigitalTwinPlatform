import { LinkOutlined } from "@mui/icons-material";
import {
  Box,
  Container,
  styled,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { newsService } from "api/news";
import SuspenseLoader from "components/SuspenseLoader";
import Footer from "content/applications/Overview/Footer";
import HeaderC from "content/applications/Overview/Header";
import { getFormattedDate, copy } from "content/utils";
import { DEFAULT_NEWS_IMAGE, NEWS_UPLOAD_URI } from "contexts/contants";
import HTMLReactParser from "html-react-parser";
import OverviewLayout from "layouts/OverviewLayout";
import { News } from "models/news";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import NewsHeader from "./NewsHeader";

const SingleNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState<News | undefined>();

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

  return (
    <>
      <Helmet>
        <title>Noticias - Panel de noticias</title>
      </Helmet>
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <NewsHeader
          author={news.author}
          date={news.date}
          readTime={news.readTime}
        />
        <Typography
          variant="h1"
          component="h1"
          sx={{ mt: 2, mb: 2, wordBreak: "break-word" }}
        >
          <b>{news?.title}</b>
        </Typography>
        <Typography component="p" variant="subtitle2" sx={{ mb: 3 }}>
          {news?.subtitle}
        </Typography>
        <img
          src={`${NEWS_UPLOAD_URI}/${news.thumbnail}`}
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
          {news && HTMLReactParser(news?.content ?? "")}
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default SingleNews;
