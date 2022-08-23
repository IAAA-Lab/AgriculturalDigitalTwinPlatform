import { Alert, Button, Input, Snackbar, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState } from "draft-js";
import { Helmet } from "react-helmet-async";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Add, Preview } from "@mui/icons-material";
import { newsService } from "api/news";
import { convertToHTML } from "draft-convert";
import { LoadingButton } from "@mui/lab";
import { escapeHtml } from "content/utils";
import { useLocation } from "react-router";
import { Result } from "models/auth";
import { News } from "models/news";
import SuspenseLoader from "components/SuspenseLoader";
import Status500 from "content/pages/Status/Status500";
import htmlToDraft from "html-to-draftjs";

const NewsEdit = () => {
  const [showNotification, setshowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<Result<News> | undefined>();
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

  const { state } = useLocation() as any;
  const id = state?.id;

  useEffect(() => {
    if (!id) return;
    loadNews();
  }, [id]);

  const loadNews = async () => {
    setLoading(true);
    const _news = await newsService.fetchOneNew(id);
    setNews(_news);
    if (_news?.isError) {
      return;
    }
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          htmlToDraft(_news?.data.content ?? "").contentBlocks
        )
      )
    );
    setLoading(false);
  };

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const showAlert = (err: boolean, msg: string) => {
    setshowNotification(true);
    setMessage(msg);
    setIsError(err);
    setLoading(false);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { title, subtitle, image, author, date, readTime } = e.target;
    if (image?.files[0]?.size > 4096000) {
      showAlert(true, "Imagen demasiado grande");
      return;
    }
    var filename;
    if (image?.files[0]) {
      filename = await newsService.uploadImage(image.files[0]);
    }
    if (filename === null) {
      showAlert(true, "Error al subir la imagen");
      return;
    }
    console.log(date.value);
    const _news = {
      title: title.value,
      subtitle: subtitle.value,
      author: author.value,
      date: date.value
        ? new Date(date.value).toISOString()
        : new Date().toISOString(),
      readTime: parseInt(readTime.value),
      thumbnail: filename?.path,
      content: escapeHtml(convertToHTML(editorState.getCurrentContent())),
    };
    const err = id
      ? await newsService.updateNews(id, _news)
      : await newsService.postNewNews(_news);
    if (err) {
      showAlert(true, "Error al subir la noticia");
      return;
    }
    showAlert(false, "Noticia subida correctamente");
  };

  if (id && !news) {
    return <SuspenseLoader />;
  }

  if (id && news?.isError) {
    return <Status500 />;
  }

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Editar noticia - Panel de noticias</title>
      </Helmet>
      <form onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          size="small"
          fullWidth
          id="title"
          label="Título"
          name="title"
          inputProps={{ maxLength: 60 }}
          defaultValue={id && !news?.isError && news?.data?.title}
          autoFocus
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          size="small"
          fullWidth
          multiline
          id="subtitle"
          label="Descripción"
          name="subtitle"
          defaultValue={id && !news?.isError && news?.data?.subtitle}
          inputProps={{ maxLength: 100 }}
        />

        <Input
          required={!id}
          disableUnderline
          fullWidth
          type="file"
          name="image"
          inputProps={{ accept: "image/*" }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          size="small"
          id="author"
          label="Autor"
          name="author"
          sx={{ mr: 2 }}
          defaultValue={id && !news?.isError && news?.data?.author}
          inputProps={{ maxLength: 50 }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required={!id}
          size="small"
          type="date"
          id="date"
          name="date"
          sx={{ mr: 2 }}
          defaultValue={
            id && !news?.isError
              ? news?.data?.date.split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          InputProps={{
            inputProps: {
              max: new Date().toISOString().split("T")[0],
            },
          }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          size="small"
          type="number"
          id="readTime"
          label="Tiempo de lectura (min)"
          defaultValue={id && !news?.isError ? news?.data?.readTime : 1}
          InputProps={{
            inputProps: {
              min: 1,
              max: 30,
            },
          }}
          name="readTime"
          sx={{
            mb: 4,
          }}
        />

        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          editorStyle={{
            border: "1px solid grey",
            borderRadius: 6,
            paddingLeft: 15,
            paddingRight: 15,
          }}
          localization={{
            locale: "es",
          }}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "list",
              "textAlign",
              "history",
              "link",
              "emoji",
            ],
            blockType: {
              inDropdown: true,
              options: ["Normal", "H2", "H3", "Blockquote", "Code"],
            },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
          }}
        />
        <LoadingButton
          fullWidth
          variant="contained"
          startIcon={<Add fontSize="small" />}
          sx={{ mt: 4 }}
          loading={loading}
          loadingIndicator="Subiendo..."
          type="submit"
        >
          {!id ? "Añadir noticia" : "Actualizar noticia"}
        </LoadingButton>
      </form>
      <Button
        color="secondary"
        variant="outlined"
        startIcon={<Preview fontSize="small" />}
        sx={{ mt: 4, mb: 4 }}
      >
        Preview
      </Button>
      <Snackbar
        open={showNotification}
        onClose={() => setshowNotification(false)}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
      >
        <Alert
          onClose={() => setshowNotification(false)}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsEdit;
