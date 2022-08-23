import { ACCESS_TOKEN_KEY, API_URL, NEWS_UPLOAD_URI } from "contexts/contants";
import { Result } from "models/auth";
import { News } from "models/news";

const fetchAllNews = async (numPage: number): Promise<Result<News[]>> => {
  const response = await fetch(API_URL + "/news?numPage=" + numPage).catch(
    () => null
  );
  if (!response || !response.ok) return { isError: true, error: new Error() };
  const data = await response.json();
  if (data === null) return { isError: true, error: new Error() };
  return { isError: false, data };
};

const fetchNumberOfNews = async (): Promise<Result<number>> => {
  const response = await fetch(API_URL + "/news/number").catch(() => null);
  if (!response || !response.ok) return { isError: true, error: new Error() };
  return { isError: false, data: await response.json() };
};

const fetchOneNew = async (id: string): Promise<Result<News> | undefined> => {
  const response = await fetch(API_URL + "/news/" + id).catch(() => null);
  if (!response || !response.ok) return { isError: true, error: new Error() };
  const data = await response.json();
  return { isError: false, data };
};

const uploadImage = async (image: any) => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch(NEWS_UPLOAD_URI + "/upload", {
    method: "POST",
    body: formData,
  }).catch((_) => null);
  if (!response || !response.ok) return null;
  return await response.json();
};

const postNewNews = async (news: News) => {
  const response = await fetch(API_URL + "/news", {
    method: "POST",
    body: JSON.stringify(news),
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }).catch((_) => null);
  if (!response || !response.ok) return true;
  return false;
};

const updateNews = async (id: string, news: News) => {
  const response = await fetch(API_URL + `/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify(news),
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }).catch((_) => null);
  if (!response || !response.ok) return true;
  return false;
};

const deleteNews = async (id: string) => {
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
  fetchNumberOfNews,
  fetchOneNew,
  postNewNews,
  deleteNews,
  uploadImage,
  updateNews,
};
