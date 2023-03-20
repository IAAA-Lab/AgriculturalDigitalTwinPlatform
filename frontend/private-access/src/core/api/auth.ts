import { API_URL } from "../config/constants";
import encrypt from "../middleware/encryption";

const login = async (username: string, password: string) => {
  const encryptedMsg = await encrypt(
    JSON.stringify({ email: username, password })
  );
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      data: encryptedMsg,
    }),
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  const token = await response.json();
  return token.accesstoken;
};

const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch((_) => null);
};

const refreshLogin = async () => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  const token = await response.json();
  return token.accesstoken;
};

export const authService = { login, logout, refreshLogin };
