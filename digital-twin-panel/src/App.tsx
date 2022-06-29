import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./app/config/routes/RouteApp";
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
              <ProtectedRoute>
                <route.layout>
                  <route.component />
                </route.layout>
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
