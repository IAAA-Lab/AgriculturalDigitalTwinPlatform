import { API_URL } from "../config/api";

const fetchAllNews = async (numPage) => {
  const response = await fetch(API_URL + "/news?numPage=" + numPage).catch(
    () => null
  );
  if (!response || !response.ok) return null;
  const data = await response.json();
  return data;
};

const fetchNumberOfNews = async () => {
  const response = await fetch(API_URL + "/news/number").catch(() => null);
  if (!response || !response.ok) return null;
  const data = await response.json();
  return data;
};

const fetchOneNew = async (id) => {
  const response = await fetch(API_URL + "/news/" + id).catch(() => null);
  if (!response || !response.ok) return null;
  const data = await response.json();
  return data;
};

const postNewNews = async (
  title,
  little_description,
  author,
  image,
  content
) => {
  const response = await fetch(API_URL + "/news", {
    method: "POST",
    body: JSON.stringify({
      title,
      little_description,
      author,
      image,
      content,
      date: new Date().toISOString(),
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch((_) => null);
  if (!response || !response.ok) return true;
  return false;
};

export const newsService = {
  fetchAllNews,
  fetchNumberOfNews,
  fetchOneNew,
  postNewNews,
};
