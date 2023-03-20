import "./style.css";
import onSubmit from "./login/login";
import Auth from "./core/middleware/auth";

const auth = new Auth();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
  </div>
  <form id="login-form">
    <h1>Acceso privado</h1>
    <h3>GEDEFEC</h3>

    <label for="username">Usuario</label>
    <input type="text" placeholder="Usuario" id="username" />

    <label for="password">Contraseña</label>
    <input type="password" placeholder="Contraseña" id="password" />

    <button type="submit">Acceder</button>
  </form>
`;

document
  .querySelector<HTMLFormElement>("#login-form")!
  .addEventListener("submit", onSubmit);
