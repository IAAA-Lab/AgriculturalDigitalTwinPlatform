import App from "./App.svelte";
import "./globals.scss";
import "leaflet/dist/leaflet.css";
import { fixDefaultLeafletIcons } from "./lib/core/functions";

fixDefaultLeafletIcons();

const app = new App({
  target: document.getElementById("app"),
});

export default app;
