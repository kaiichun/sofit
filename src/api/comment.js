import axios from "axios";

import { API_URL } from "./data";

export const addVideoComment = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/comments/add",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const fetchComments = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/comments/" + id,
  });
  return response.data;
};

export const deleteComment = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/comments/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteCommentAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/comments/admin/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
