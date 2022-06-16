import React, { useEffect, useState } from "react";
import { newsService } from "../api/news";
import classNames from "classnames";
import { SpinnerDotted } from "spinners-react";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail";
import createImagePlugin from "draft-js-image-plugin";
import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";

const imagePlugin = createImagePlugin();

export const NewsPanel = () => {
  const [show, setShow] = useState(false);
  const [postError, setPostError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(EditorState.createEmpty());

  const notificationClassnames = classNames(
    "text-xs fw-500 m-16",
    postError ? "notification-error" : "notification-success"
  );

  const postNewNews = async (e) => {
    e.preventDefault();
    const { title, description, author, image } = e.target;
    if (image.files[0].size > 4096000) {
      showNotification(true);
      return;
    }
    setIsLoading(true);
    const filename = await newsService.uploadImage(image.files[0]);
    if (filename === null) {
      showNotification(true);
      return;
    }
    const err = await newsService.postNewNews(
      title.value,
      description.value,
      author.value,
      filename.path,
      convertToHTML(content.getCurrentContent())
    );
    if (err) {
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

  const initial = JSON.parse(sessionStorage.getItem("draftail:content"));

  const onSave = (content) => {
    sessionStorage.setItem("draftail:content", JSON.stringify(content));
  };

  return (
    <section className="hero section">
      <div className="hero-content mb-16">
        <div className="container-sm reveal-from-bottom">
          <h3>Panel de noticias</h3>
          <form className="tiles-col" onSubmit={postNewNews}>
            <label className="form-label">Título</label>
            <input
              required
              type="text"
              name="title"
              maxLength={60}
              className="text-xxs form-input-sm"
            />
            <label className="form-label">Autor</label>
            <input
              required
              name="author"
              maxLength={40}
              className="text-xxs form-input-sm"
              style={{ resize: "none" }}
            />
            <label className="form-label">Descripción</label>
            <textarea
              required
              name="description"
              maxLength={100}
              className="text-xxs form-input-sm"
              style={{ resize: "none", height: "100px" }}
            />
            <label className="form-label">Imagen</label>
            <input
              required
              type="file"
              accept="image/*"
              name="image"
              className="mb-8"
            />
            {/* <img src="#" alt="news main image" onChange={() => {}} /> */}
            <label className="form-label">Contenido</label>
            <DraftailEditor
              rawContentState={initial || null}
              onSave={onSave}
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
              Nueva noticia
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
