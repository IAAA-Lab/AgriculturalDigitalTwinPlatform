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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  const token = await response.json();
  return token.accesstoken;
};

const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  }).catch((_) => null);
};

const refreshLogin = async () => {
  const response = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  const token = await response.json();
  return token.accesstoken;
};

export const authService = { login, logout, refreshLogin };
