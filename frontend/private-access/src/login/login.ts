import { authService } from "../core/api/auth";
import { BASEPATH } from "../core/config/constants";

const onSubmit = async (e: any) => {
  e.preventDefault();
  const { username, password } = e.target.elements;
  const accessToken = await authService.login(username.value, password.value);
  if (!accessToken) {
    e.preventDefault();
    alert("Usuario o contraseña incorrectos");
  } else {
    localStorage.setItem("accessToken", accessToken);
    location.replace(BASEPATH + "/src/file-drop/file-drop.html");
  }
};

export default onSubmit;
