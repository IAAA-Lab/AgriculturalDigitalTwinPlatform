import {
  Alert,
  Button,
  FormControl,
  IconButton,
  Input,
  Snackbar,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";
import { Helmet } from "react-helmet-async";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Add } from "@mui/icons-material";
import { newsService } from "api/news";
import { convertToHTML } from "draft-convert";
import { LoadingButton } from "@mui/lab";
import { escapeHtml } from "content/utils";

const NewsEdit = () => {
  const [showNotification, setshowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

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
    if (image.files[0]?.size > 4096000) {
      showAlert(true, "Imagen demasiado grande");
      return;
    }
    var filename;
    if (image.files[0]) {
      filename = await newsService.uploadImage(image.files[0]);
    }
    if (filename === null) {
      showAlert(true, "Error al subir la imagen");
      return;
    }
    const err = await newsService.postNewNews({
      title: title.value,
      subtitle: subtitle.value,
      author: author.value,
      date: date.value && new Date(date.value).toISOString(),
      readTime: parseInt(readTime.value),
      thumbnail: filename.path,
      content: escapeHtml(convertToHTML(editorState.getCurrentContent())),
    });
    if (err) {
      showAlert(true, "Error al subir la noticia");
      return;
    }
    showAlert(false, "Noticia subida correctamente");
  };

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
          inputProps={{ maxLength: 100 }}
        />

        <Input
          required
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
          inputProps={{ maxLength: 50 }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          size="small"
          type="datetime-local"
          id="date"
          name="date"
          sx={{ mr: 2 }}
          defaultValue={new Date().toISOString().split("T")[0]}
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
          defaultValue={1}
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
          Añadir noticia
        </LoadingButton>
      </form>
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
