import { ACCESS_TOKEN_KEY, API_URL } from "contexts/contants";
import { Result } from "models/auth";
import { User } from "models/user";
import encrypt from "../middleware/encryption";

const fetchAllUsers = async (): Promise<Result<User[]>> => {
  const response = await fetch(API_URL + "/users", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }).catch(() => null);
  if (!response || !response.ok) return { isError: true, error: Error() };
  return {
    isError: false,
    data: (await response.json()) as User[],
  };
};

const deleteUser = async (id: string) => {
  const response = await fetch(API_URL + "/users/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }).catch(() => null);
  if (!response || !response.ok) return false;
  return true;
};

const createUser = async (username: string, password: string, role: string) => {
  console.log(username, password, role);
  const encryptedMsg = encrypt(JSON.stringify({ username, password, role }));
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    body: JSON.stringify({ data: encryptedMsg }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
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
