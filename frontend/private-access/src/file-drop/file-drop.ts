// import * as FilePond from "filepond";
// import * as htmx from "htmx.org";
import * as FilePond from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { API_URL } from "../core/config/constants";
import Auth from "../core/middleware/auth";

const auth = new Auth();

FilePond.registerPlugin(FilePondPluginFileValidateType);

const pond = FilePond.create(
  document.querySelector('input[type="file"]') as HTMLInputElement,
  {
    allowMultiple: true,
    instantUpload: false,
    allowRevert: false,
    server: {
      url: API_URL + "/internal/files/upload",
    },
    acceptedFileTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      ".csv",
      "application/json",
    ],
    fileValidateTypeLabelExpectedTypes:
      "Sólo se permiten .xlsx, .csv, .pdf o .json",
    labelFileTypeNotAllowed: "No se permite este tipo de archivo",
    labelIdle:
      "Arrastra y suelta tus archivos o <span class='filepond--label-action'> Busca archivos </span>",
    labelFileLoading: "Cargando...",
    labelFileLoadError: "Error al cargar",
    labelFileProcessing: "Subiendo...",
    labelFileProcessingComplete: "Subido",
    labelTapToCancel: "Pulsa para cancelar",
  }
);

// Add it to the DOM
document.body.appendChild(pond.element as Node);
