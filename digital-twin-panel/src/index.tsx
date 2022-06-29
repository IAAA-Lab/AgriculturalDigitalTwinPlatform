import React from "react";
import ReactDOM from "react-dom/client";
import "../src/app/assets/scss/style.scss";
import "leaflet/dist/leaflet.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./app/config/context/redux/app-store";
import "react-loading-skeleton/dist/skeleton.css";
import AuthProtection from "./app/config/routes/AuthProtection";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProtection>
        <App />
      </AuthProtection>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
