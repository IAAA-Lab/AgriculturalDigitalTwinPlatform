import { API_URL } from "contexts/contants";
import { MustRefreshSessionError } from "errors/Exceptions";
import { Result } from "models/auth";
import encrypt from "../middleware/encryption";

const login = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  const encryptedMsg = encrypt(JSON.stringify({ username, password }));
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      data: encryptedMsg,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((_) => null);
  if (!response || !response.ok) return undefined;
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
