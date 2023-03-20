import { authService } from "../core/api/auth";

const onSubmit = async (e: any) => {
  e.preventDefault();
  const { username, password } = e.target.elements;
  const accessToken = await authService.login(username.value, password.value);
  if (!accessToken) {
    e.preventDefault();
    alert("Usuario o contraseña incorrectos");
  } else {
    localStorage.setItem("accessToken", accessToken);
    location.replace("/src/file-drop/file-drop.html");
  }
};

export default onSubmit;
