import React, { useCallback, useEffect, useRef, useState } from "react";
import { NewsEdit } from "./NewsEdit";
import { Link } from "react-router-dom";
import { SpinnerDotted } from "spinners-react";
import { newsService } from "../api/news";
import ReactPaginate from "react-paginate";
import Image from "../components/elements/Image";
import { NEWS_UPLOAD_URL } from "../config/api";
import { getFormattedDate } from "../utils/functions";

export const NewsPanel = ({ itemsPerPage = 6 }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    newsService.fetchNumberOfNews().then((number) => {
      setPageCount(Math.ceil(number / itemsPerPage));
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    newsService.fetchAllNews(selectedPage).then((news) => {
      setNews(news ?? []);
      setIsLoading(false);
    });
  }, [selectedPage]);

  const handlePageChange = (event) => {
    setSelectedPage(event.selected);
    newsService.fetchNumberOfNews().then((number) => {
      setPageCount(Math.ceil(number / itemsPerPage));
    });
  };

  if (isError) {
    return <div className="notification-error">Algo fue mal...</div>;
  }

  if (isLoading) {
    return (
      <div className="spinner-container">
        <SpinnerDotted size={65} />
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h3 className="text-2xl font-bold">Panel de noticias</h3>
        <Link to="/panel-news/add">
          <button className="button button-primary button-wide-mobile">
            Añadir noticia
          </button>
        </Link>
        <div className="table-wrap mt-16">
          <table>
            <thead>
              <tr>
                <th>Noticia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {news.map(
                ({
                  ID,
                  Title,
                  little_description,
                  Date,
                  Author,
                  Image,
                  read_min,
                }) => {
                  return (
                    <tr key={ID}>
                      <td>
                        <div
                          className="row"
                          style={{ display: "flex", flexWrap: "wrap" }}
                        >
                          <img
                            src={`${NEWS_UPLOAD_URL}/${Image}`}
                            style={{
                              objectFit: "cover",
                              width: "70px",
                              height: "70px",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg";
                            }}
                          />
                          <div className="col ml-8">
                            <p className="text-sm">{Title}</p>
                            <span className="text-xxs">
                              {Author} · {getFormattedDate(Date)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="button-group">
                          <Link
                            to={`/panel-news/edit/${ID}?title=${Title}&littleDescription=${little_description}&date=${Date}&author=${Author}&image=${NEWS_UPLOAD_URL}/${Image}&readMin=${read_min}`}
                          >
                            <button
                              style={{ cursor: "pointer" }}
                              className="button-secondary"
                            >
                              Editar
                            </button>
                          </Link>
                          <button
                            className="button-delete"
                            style={{ cursor: "pointer" }}
                            onClick={async () => {
                              if (!(await newsService.deleteNews(ID)))
                                setNews(news.filter((news) => news.ID !== ID));
                            }}
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <div className="pagination center-content">
            <ReactPaginate
              breakLabel="..."
              nextLabel={
                <strong className="text-sm text-color-primary">{">"}</strong>
              }
              pageRangeDisplayed={3}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              previousLabel={
                <strong className="text-sm text-color-primary">{"<"}</strong>
              }
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
