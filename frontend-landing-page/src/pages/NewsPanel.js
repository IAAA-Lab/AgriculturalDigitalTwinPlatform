import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import { newsService } from "../api/news";
import classNames from "classnames";

export const NewsPanel = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [show, setShow] = useState(false);
  const [postError, setPostError] = useState(false);
  const notificationClassnames = classNames(
    "text-xs fw-500 m-16",
    postError ? "notification-error" : "notification-success"
  );

  const postNewNews = async (e) => {
    e.preventDefault();
    const { title, description, author } = e.target;
    const err = await newsService.postNewNews(
      title.value,
      description.value,
      author.value,
      "https://previews.123rf.com/images/alhovik/alhovik1709/alhovik170900031/86481591-breaking-news-background-world-global-tv-news-banner-design.jpg",
      ""
    );
    if (err) {
      setPostError(true);
      showNotification();
      return;
    }
    setPostError(false);
    showNotification();
  };

  const showNotification = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
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
            <input type="file" name="image" />
            <label className="form-label">Contenido</label>
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
            <button
              type="submit"
              className="button button-wide-mobile button-sm button-primary"
            >
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
