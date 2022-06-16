import { API_URL } from "../config/api";
import encrypt from "../middleware/auth";

const fetchAllUsers = async () => {
  const response = await fetch(API_URL + "/users", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch(() => null);
  if (!response || !response.ok) return null;
  return await response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(API_URL + "/users/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch(() => null);
  if (!response || !response.ok) return false;
  return true;
};

const createUser = async (username, password, role) => {
  const encrypted_passwd = await encrypt(password);
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      password: encrypted_passwd,
      role,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch(() => null);
  if (!response || !response.ok) return false;
  return true;
};

export const usersService = {
  fetchAllUsers,
  deleteUser,
  createUser,
};
