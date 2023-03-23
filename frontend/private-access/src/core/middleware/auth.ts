import jwt_decode from "jwt-decode";

class Auth {
  // setup the class and hide the body by default
  constructor() {
    document!.querySelector("body")!.style.display = "none";
    const auth = localStorage.getItem("accessToken");
    this.validateAuth(auth);
  }
  // check to see if the localStorage item passed to the function is valid and set
  validateAuth(auth: string | null) {
    if (!auth) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
        return;
      }
      document!.querySelector("body")!.style.display = "block";
      return;
    }

    const decodedToken = jwt_decode<{ exp: number }>(auth);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("accessToken");
      window.location.replace("/");
      return;
    }

    document!.querySelector("body")!.style.display = "block";
    if (window.location.pathname === "/") {
      window.location.replace("/src/file-drop/file-drop.html");
    }
  }
  // will remove the localStorage item and redirect to login  screen
  logOut() {
    localStorage.removeItem("auth");
    window.location.replace("/");
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }
}

export default Auth;
