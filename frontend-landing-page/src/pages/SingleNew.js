import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NewInfo } from "../components/sections/NewInfo";
import classNames from "classnames";
import Image from "../components/elements/Image";
import HTMLReactParser from "html-react-parser";
import { newsService } from "../api/news";
import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../utils/functions";

export const SingleNew = ({ ...props }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [littleDescription, setLittleDescription] = useState("");
  const [author, setAuthor] = useState("");

  let { id } = useParams();
  const params = useLocation().search;

  useEffect(() => {
    setTitle(new URLSearchParams(params).get("title"));
    setLittleDescription(new URLSearchParams(params).get("littleDescription"));
    setAuthor(new URLSearchParams(params).get("author"));
    setDate(getFormattedDate(new URLSearchParams(params).get("date")));
    setImage(new URLSearchParams(params).get("image"));
    newsService.fetchOneNew(id).then((data) => {
      setDescription(data === null ? "" : data.Content);
    });
  }, [id, params]);

  const outerClasses = classNames("hero section", "illustration-section-01");
  const innerClasses = classNames(
    "features-tiles-inner section-inner pt-0 reveal-from-top"
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses} data-reveal-delay="50">
          <NewInfo author={author} date={date} />
          <h3 className="mt-0 mb-8">{title}</h3>
          <p className="text-xs">{littleDescription}</p>
          <div>
            <img
              src={image}
              alt="new image"
              width="100%"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg";
              }}
            />
            <figcaption>Foto por Giovanni Giorgio</figcaption>
          </div>
          <div className="mt-32 text-sm">{HTMLReactParser(description)}</div>
        </div>
      </div>
    </section>
  );
};
