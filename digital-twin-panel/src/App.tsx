import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { doValidateLogin } from "./app/config/context/redux/app-actions";
import {
  RootState,
  useTypedDispatch,
} from "./app/config/context/redux/app-store";
import AuthProtection from "./app/config/routes/AuthProtection";
import { getRoutes } from "./app/config/routes/routes";
import { Page404 } from "./infraestructure/delivery/presentation/pages/Page404";

function App() {
  const dispatch = useTypedDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(doValidateLogin());
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProtection auth={auth}>
        <Routes>
          {getRoutes(auth).map((route, index) => (
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
      </AuthProtection>
    </BrowserRouter>
  );
}

export default App;
