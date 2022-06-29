import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProtection from "./app/config/routes/AuthProtection";
import { getRoutes } from "./app/config/routes/routes";
import { Page404 } from "./infraestructure/delivery/presentation/pages/Page404";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        {getRoutes(true).map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <route.layout>
                <route.component />
              </route.layout>
            }
          />
        ))}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
