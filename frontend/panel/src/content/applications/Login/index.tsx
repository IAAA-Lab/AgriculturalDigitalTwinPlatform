import { LoginOutlined } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  Link,
  Snackbar,
  TextField,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { doLogin } from "contexts/redux/app-actions";
import { RootState, useTypedDispatch } from "contexts/redux/app-store";
import { useSelector } from "react-redux";
import { LoginError } from "errors/Exceptions";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useTypedDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth?.isError) {
      console.log(auth.error instanceof LoginError);
      if (auth.error instanceof LoginError) {
        setShowError(true);
      }
    }
    setLoading(false);
  }, [auth]);

  return (
    <>
      <Helmet>
        <title>Login · GEDEFEC</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          m: 1,
        }}
      >
        <Card variant="outlined">
          <CardHeader
            avatar={
              <Avatar>
                <LoginOutlined />
              </Avatar>
            }
            title="Inicio de sesión"
          />
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const { email, password } = e.target as any;
                setLoading(true);
                dispatch(doLogin(email.value, password.value));
              }}
            >
              <FormControl>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  size="small"
                  fullWidth
                  id="email"
                  type="email"
                  label="Email"
                  name="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  size="small"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Recuérdame"
                />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                  sx={{ mb: 2, mt: 4 }}
                >
                  Iniciar sesión
                </LoadingButton>
                <Link variant="body2" sx={{ width: "80%" }}>
                  {"¿No tienes una cuenta? Contacta con el administrador."}
                </Link>
              </FormControl>
            </form>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={showError}
        onClose={() => setShowError(false)}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error al iniciar sesión
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
