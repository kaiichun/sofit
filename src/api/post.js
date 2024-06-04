import axios from "axios";

import { API_URL } from "./data";

export const fetchPosts = async (keyword = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/posts?" + (keyword !== "" ? "keyword=" + keyword : ""),
  });
  return response.data;
};

export const getPosts = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/posts/" + id,
  });
  return response.data;
};

export const addPostDetails = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/posts",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addPostImage = async (file) => {
  const formData = new FormData();
  formData.append("postImage", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/posts",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadPostImage = async (file) => {
  const formData = new FormData();
  formData.append("postImage", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadPostImage",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const updatePost = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/posts/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deletePost = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/posts/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deletePostAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/posts/admin/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
