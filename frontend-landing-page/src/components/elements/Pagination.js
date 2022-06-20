import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Image from "./Image";
import classNames from "classnames";
import { newsService } from "../../api/news";
import { getFormattedDate } from "../../utils/functions";
import { SpinnerDotted } from "spinners-react";
import { NEWS_UPLOAD_URL } from "../../config/api";

export const PaginatedItems = ({ itemsPerPage }) => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tilesClasses = classNames("tiles-wrap");

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    const number = await newsService.fetchNumberOfNews();
    if (number === null) {
      showNotification();
      setIsLoading(false);
      return;
    }
    setPageCount(Math.ceil(number / itemsPerPage));
    setIsLoading(false);
    const news = await newsService.fetchAllNews(pageCount);
    if (news === null) {
      showNotification();
      setIsLoading(false);
      return;
    }
    setCurrentItems(news);
    setIsLoading(false);
  };

  const showNotification = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
  };

  const listOfitems = currentItems.map(
    (e) => (
      console.log(e),
      (
        <div key={e.ID} className="tiles-item">
          <div className="tiles-item-inner">
            <Link
              to={`/blog/${e.ID}?title=${e.Title}&littleDescription=${e.little_description}&date=${e.Date}&author=${e.Author}&image=${NEWS_UPLOAD_URL}/${e.Image}&readMin=${e.read_min}`}
            >
              <div className="features-tiles-item-header center-content">
                <div className="features-tiles-item-image-no-bg mb-16">
                  <Image
                    src={`${NEWS_UPLOAD_URL}/${e.Image}`}
                    alt="Features tile icon 01"
                    style={{
                      objectFit: "cover",
                      width: "350px",
                      height: "200px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg";
                    }}
                  />
                </div>
              </div>
            </Link>
            <div className="features-tiles-item-content">
              <h4 className="mt-0 mb-0">{e.Title}</h4>
              <p className="m-0 text-xxs">{e.Author}</p>
              <div className="text-xxs text-color-primary fw-600 mb-8">
                {getFormattedDate(e.Date)} · {e.read_min} min lectura
              </div>
              <p className="m-0 text-sm">{e.little_description}</p>
            </div>
          </div>
        </div>
      )
    )
  );

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setIsLoading(true);
    newsService.fetchAllNews(event.selected).then((data) => {
      if (data === null) {
        showNotification();
        setIsLoading(false);
        return;
      }
      setCurrentItems(data);
      setIsLoading(false);
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="spinner-container">
          <SpinnerDotted size={65} />
        </div>
      ) : (
        <div className={tilesClasses}>{listOfitems}</div>
      )}
      <div className="center-content reveal-from-bottom">
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <strong className="text-sm text-color-primary">{">"}</strong>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={
            <strong className="text-sm text-color-primary">{"<"}</strong>
          }
          renderOnZeroPageCount={null}
        />
        {show && (
          <div className="notification-error text-xs fw-500">
            Oops! Las noticias no se han podido cargar correctamente.
          </div>
        )}
      </div>
    </>
  );
};
