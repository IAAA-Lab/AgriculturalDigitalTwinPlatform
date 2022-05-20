import React, { useContext, useEffect, useState, useRef } from "react";
import { authService } from "../../api/auth";
import AuthContext from "../../context/contexts";
import { SpinnerDotted } from "spinners-react";
import { decodeToken } from "react-jwt";

export const Login = ({ closeModal }) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = e.target;
    setIsLoading(true);
    authService.login(username.value, password.value).then((token) => {
      if (!token) {
        alert("Wrong username or password");
      } else {
        closeModal(e);
        const decodedToken = decodeToken(token);
        auth.actions.login({ role: decodedToken.role, logged: true }, token);
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="hero section">
      <div className="tiles-row">
        <img
          style={{ maxWidth: 380 }}
          src={require("./../../assets/images/plant-login.jpg")}
          alt="plant-login"
          width="100%"
          height="100%"
        />
        <div className="hero-content m-16">
          <h4 style={{ position: "absolute", top: -10, left: 20 }}>Acceso</h4>
          <form onSubmit={onSubmit}>
            <label className="text-xs">Usuario</label>
            <input
              name="username"
              className="text-xxs form-input-sm"
              type="text"
              style={{ width: "100%" }}
              required
            />
            <label className="text-xs">Contraseña</label>
            <input
              name="password"
              className="text-xxs form-input-sm"
              type="password"
              style={{ width: "100%" }}
              required
              ref={bottomRef}
            />
            <button
              className="button button-primary button-wide-mobile button-sm mt-16"
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
      </div>
    </section>
  );
};
