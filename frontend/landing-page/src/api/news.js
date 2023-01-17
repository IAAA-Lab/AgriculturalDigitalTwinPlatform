import { API_URL, NEWS_UPLOAD_URL } from "../config/api";
import { escapeHtml } from "../utils/functions";

const fetchAllNews = async (numPage) => {
  const response = await fetch(API_URL + "/news?numPage=" + numPage).catch(
    () => null
  );
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

const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("path", "news");
  const response = await fetch(NEWS_UPLOAD_URL, {
    method: "POST",
    body: formData,
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  return await response.json();
};

const postNewNews = async (
  title,
  little_description,
  author,
  image,
  read_min,
  content,
  date
) => {
  const response = await fetch(API_URL + "/news", {
    method: "POST",
    body: JSON.stringify({
      info: {
        title,
        subtitle: little_description,
        author,
        thumbnail: image,
        content: escapeHtml(content),
        readTime: read_min,
        date,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch((_) => null);
  if (!response || !response.ok) return true;
  return false;
};

const updateNews = async (
  id,
  title,
  little_description,
  author,
  image,
  read_min,
  content,
  date
) => {
  const response = await fetch(API_URL + `/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      little_description,
      author,
      image,
      content: escapeHtml(content),
      read_min,
      date,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  }).catch((_) => null);
  if (!response || !response.ok) return false;
  return true;
};

const deleteNews = async (id) => {
  const response = await fetch(API_URL + `/news/${id}`, {
    method: "DELETE",
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
  fetchOneNew,
  postNewNews,
  uploadImage,
  updateNews,
  deleteNews,
};
