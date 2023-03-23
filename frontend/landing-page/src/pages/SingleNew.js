import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NewInfo } from "../components/sections/NewInfo";
import classNames from "classnames";
import Image from "../components/elements/Image";
import HTMLReactParser from "html-react-parser";
import { newsService } from "../api/news";
import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../utils/functions";
import { API_URL } from "../config/constants";

export const SingleNew = ({ ...props }) => {
  let { id } = useParams();
  const [news, setNews] = useState({});

  useEffect(() => {
    if (!id) return;
    newsService.fetchOneNew(id).then((data) => {
      if (!data) return;
      setNews(data);
    });
  }, [id]);

  const outerClasses = classNames("hero section", "illustration-section-01");
  const innerClasses = classNames(
    "features-tiles-inner section-inner pt-0 reveal-from-top"
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses} data-reveal-delay="50">
          <NewInfo
            author={news.author}
            date={news.date}
            readMin={news.readTime}
          />
          <h3 className="mt-0 mb-8">{news.title}</h3>
          <p className="text-xs">{news.subtitle}</p>
          <div>
            <img
              loading="lazy"
              src={`${API_URL}/images/news/${news.thumbnail}`}
              alt="image"
              width="100%"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg";
              }}
            />
          </div>
          <div className="mt-32 text-sm">
            {HTMLReactParser(news.content ?? "")}
          </div>
        </div>
      </div>
    </section>
  );
};
