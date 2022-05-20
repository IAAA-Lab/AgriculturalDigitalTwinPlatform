import { API_URL } from "../config/api";
import encrypt from "../middleware/auth";

const login = async (username, password) => {
  const encrypt_passwd = await encrypt(password);
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: encrypt_passwd,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  const token = await response.json();
  return token;
};

export const authService = { login };
