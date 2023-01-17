import React, { useEffect, useState } from "react";
import { newsService } from "../api/news";
import classNames from "classnames";
import { SpinnerDotted } from "spinners-react";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail";
import createImagePlugin from "draft-js-image-plugin";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { ContentState, EditorState } from "draft-js";
import { useLocation, useParams } from "react-router-dom";
import htmlToDraft from "html-to-draftjs";
import { getFormattedDate } from "../utils/functions";

const imagePlugin = createImagePlugin();

export const NewsEdit = () => {
  const [show, setShow] = useState(false);
  const [postError, setPostError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocation().search;
  let { id } = useParams();
  const [content, setContent] = useState(EditorState.createEmpty());

  const notificationClassnames = classNames(
    "text-xs fw-500 m-16",
    postError ? "notification-error" : "notification-success"
  );

  useEffect(() => {
    if (id)
      newsService.fetchOneNew(id).then((data) => {
        if (!data) return;
        const html = htmlToDraft(data.Content);
        setContent(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(html.contentBlocks)
          )
        );
      });
  }, []);

  const postNewNews = async (e) => {
    e.preventDefault();
    const { title, description, author, image, minRead, date } = e.target;
    if (image.files[0]?.size > 4096000) {
      showNotification(true);
      return;
    }
    setIsLoading(true);
    var filename;
    if (image.files[0]) {
      filename = await newsService.uploadImage(image.files[0]);
    }
    if (filename === null) {
      showNotification(true);
      return;
    }
    const err = id
      ? await newsService.updateNews(
          id,
          title.value,
          description.value,
          author.value,
          filename,
          parseInt(minRead.value),
          convertToHTML(content.getCurrentContent()),
          date.value && new Date(date.value).toISOString()
        )
      : newsService.postNewNews(
          title.value,
          description.value,
          author.value,
          filename,
          parseInt(minRead.value),
          convertToHTML(content.getCurrentContent()),
          date.value
            ? new Date(date.value).toISOString()
            : new Date().toISOString()
        );
    if (!err) {
      showNotification(true);
      return;
    }
    showNotification(false);
  };

  const showNotification = (error) => {
    setIsLoading(false);
    setPostError(error);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
  };

  const onChange = (content) => {
    // sessionStorage.setItem("draftail:content", JSON.stringify(content));
    setContent(content);
  };

  return (
    <section className="hero section">
      <div className="hero-content mb-16">
        <div className="container-sm reveal-from-bottom">
          <form className="tiles-col" onSubmit={postNewNews}>
            <label className="form-label">Título</label>
            <input
              required
              type="text"
              name="title"
              defaultValue={new URLSearchParams(params).get("title") || ""}
              maxLength={60}
              className="text-xxs form-input-sm"
            />
            <label className="form-label mt-8">Autor</label>
            <input
              required
              name="author"
              maxLength={40}
              className="text-xxs form-input-sm"
              defaultValue={new URLSearchParams(params).get("author") || ""}
              style={{ resize: "none" }}
            />
            <label className="form-label mt-8">Descripción</label>
            <textarea
              required
              name="description"
              maxLength={100}
              className="text-xxs form-input-sm"
              defaultValue={
                new URLSearchParams(params).get("littleDescription") || ""
              }
              style={{ resize: "none", height: "100px" }}
            />
            <label className="form-label mt-8">Imagen</label>
            <input
              required={!id}
              type="file"
              accept="image/*"
              name="image"
              className="mb-8"
            />
            <label className="form-label mt-8">Contenido</label>
            <DraftailEditor
              onChange={onChange}
              editorState={content}
              blockTypes={[
                { type: BLOCK_TYPE.HEADER_FOUR },
                { type: BLOCK_TYPE.CODE },
                { type: BLOCK_TYPE.BLOCKQUOTE },
                { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
              ]}
              inlineStyles={[
                { type: INLINE_STYLE.BOLD },
                { type: INLINE_STYLE.ITALIC },
                { type: INLINE_STYLE.UNDERLINE },
                { type: INLINE_STYLE.SMALL },
              ]}
              plugins={[imagePlugin]}
            />
            <label className="form-label mt-8">Minutos de lectura</label>
            <input
              className="text-xxs form-input-sm p-8"
              style={{ maxWidth: 100 }}
              type="number"
              name="minRead"
              max={30}
              min={1}
              defaultValue={new URLSearchParams(params).get("readMin") || 1}
            />
            <label className="form-label mt-8">Fecha de publicación</label>
            <input
              className="text-xxs form-input-sm p-8"
              type="date"
              name="date"
              defaultValue={
                new URLSearchParams(params).get("date") &&
                getFormattedDate(new URLSearchParams(params).get("date"))
              }
              max={new Date().toISOString().split("T")[0]}
            />
            <button
              type="submit"
              className="button button-primary mt-32"
              disabled={isLoading}
            >
              <SpinnerDotted
                size={20}
                enabled={isLoading}
                className="mr-16"
                color="white"
              />
              {id ? "Editar noticia" : "Nueva noticia"}
            </button>
          </form>
        </div>
        {show && (
          <div className={notificationClassnames}>
            {postError ? "Error al publicar la noticia" : "Noticia publicada"}
          </div>
        )}
      </div>
    </section>
  );
};
