import { useRoutes } from "react-router-dom";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import router from "./router";
import { useEffect } from "react";
import { RootState, useTypedDispatch } from "contexts/redux/app-store";
import { doValidateLogin } from "contexts/redux/app-actions";
import getRoutes from "./router";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const content = useRoutes(getRoutes(auth));
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(doValidateLogin());
  }, []);

  return (
    <ThemeProvider>
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      <CssBaseline />
      {content}
      {/* </LocalizationProvider> */}
    </ThemeProvider>
  );
}
export default App;
