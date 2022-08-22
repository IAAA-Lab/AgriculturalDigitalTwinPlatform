import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import "nprogress/nprogress.css";
import App from "./App";
import { unregister } from "./serviceWorker";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "contexts/redux/app-store";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container!);
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </HelmetProvider>
);

unregister();
