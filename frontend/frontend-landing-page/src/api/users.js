// import { API_URL } from "../config/constants";
// import encrypt from "../middleware/encryption";

// const fetchAllUsers = async () => {
//   const response = await fetch(API_URL + "/users", {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("jwtToken"),
//     },
//   }).catch(() => null);
//   if (!response || !response.ok) return null;
//   return await response.json();
// };

// const deleteUser = async (id) => {
//   const response = await fetch(API_URL + "/users/" + id, {
//     method: "DELETE",
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("jwtToken"),
//     },
//   }).catch(() => null);
//   if (!response || !response.ok) return false;
//   return true;
// };

// const createUser = async (username, password, role) => {
//   const encryptedMsg = await encrypt(
//     JSON.stringify({ username, password, role })
//   );
//   const response = await fetch(API_URL + "/users", {
//     method: "POST",
//     body: JSON.stringify({ data: encryptedMsg }),
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + localStorage.getItem("jwtToken"),
//     },
//   }).catch(() => null);
//   if (!response || !response.ok) return false;
//   return true;
// };

// export const usersService = {
//   fetchAllUsers,
//   deleteUser,
//   createUser,
// };
