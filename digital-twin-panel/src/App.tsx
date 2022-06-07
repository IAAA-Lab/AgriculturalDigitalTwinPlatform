import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getRoutes } from "./app/config/routes/routes";
import { Page404 } from "./infraestructure/delivery/presentation/pages/Page404";

function App() {
  return (
    <BrowserRouter>
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
