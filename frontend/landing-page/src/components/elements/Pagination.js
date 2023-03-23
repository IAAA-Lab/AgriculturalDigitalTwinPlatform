import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Image from "./Image";
import classNames from "classnames";
import { newsService } from "../../api/news";
import { getFormattedDate } from "../../utils/functions";
import { SpinnerDotted } from "spinners-react";
import { API_URL, NEWS_UPLOAD_URL } from "../../config/constants";

export const PaginatedItems = ({ itemsPerPage }) => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tilesClasses = classNames("tiles-wrap-spread");

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const news = await newsService.fetchAllNews(pageCount);
    setIsLoading(false);
    if (news === null) {
      showNotification();
      setIsLoading(false);
      return;
    }
    setCurrentItems(news.news ?? []);
    setPageCount(Math.ceil(news.number / itemsPerPage));
  };

  const showNotification = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
  };

  const listOfitems = currentItems.map((e) => (
    <div key={e.id}>
      <div className="tiles-item-inner">
        <Link to={`/blog/${e.id}`}>
          <div className="features-tiles-item-header">
            <div className="features-tiles-item-image mb-16">
              <Image
                src={`${API_URL}/images/news/${e.thumbnail}`}
                alt="Features tile icon 01"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg";
                }}
              />
            </div>
          </div>
          <h4 className="mt-0 mb-0">{e.title}</h4>
        </Link>
        <p className="m-0 text-xxs">{e.author}</p>
        <div className="text-xxs text-color-primary fw-600 mb-8">
          {getFormattedDate(e.date)} · {e.readTime} min lectura
        </div>
        <p className="m-0 text-sm">{e.subtitle}</p>
      </div>
    </div>
  ));

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setIsLoading(true);
    newsService.fetchAllNews(event.selected).then((data) => {
      if (data === null) {
        showNotification();
        setIsLoading(false);
        return;
      }
      setCurrentItems(data.news);
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <SpinnerDotted size={65} />
      </div>
    );
  }

  return (
    <>
      <div className={tilesClasses}>{listOfitems}</div>
      <div className="center-content mt-32">
        {show && (
          <div className="notification-error text-xs fw-500">
            Oops! Las noticias no se han podido cargar correctamente.
          </div>
        )}
      </div>
    </>
  );
};
