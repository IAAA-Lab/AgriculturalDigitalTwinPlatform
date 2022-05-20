import { API_URL } from "../config/api";

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
  if (!response || !response.ok) return null;
  return await response.json();
};

const createUser = async (name, password, role) => {
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    body: JSON.stringify({
      name,
      password,
      role,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch(() => null);
  if (!response || !response) return null;
  return await response.json();
};

export const usersService = {
  fetchAllUsers,
  deleteUser,
  createUser,
};
