import React, { useContext, useEffect, useState, useRef } from "react";
import { authService } from "../../api/auth";
import AuthContext from "../../context/contexts";
import { SpinnerDotted } from "spinners-react";
import { decodeToken } from "react-jwt";

export const Login = ({ closeModal }) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = e.target;
    setIsLoading(true);
    authService.login(username.value, password.value).then((token) => {
      if (!token) {
        alert("Contraseña o usuario incorrectos");
      } else {
        closeModal(e);
        const decodedToken = decodeToken(token);
        auth.actions.login({ role: decodedToken.role, logged: true }, token);
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="login-section">
      <div className="login-section-image">
        <img
          loading="lazy"
          src={require("./../../assets/images/plant-login.png")}
          alt="plant-login"
        />
      </div>
      <h4 style={{ position: "absolute", top: -10, left: 20 }}>Acceso</h4>
      <div className="login-section-content">
        <form onSubmit={onSubmit}>
          <label className="text-xs">Usuario</label>
          <input
            name="username"
            className="text-xxs form-input-sm"
            type="text"
            required
          />
          <label className="text-xs">Contraseña</label>
          <input
            name="password"
            className="text-xxs form-input-sm"
            type="password"
            required
          />
          <button
            className="button button-primary button-sm mt-16"
            type="submit"
            disabled={isLoading}
          >
            <SpinnerDotted
              size={20}
              enabled={isLoading}
              className="mr-16"
              color="white"
            />
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
};
