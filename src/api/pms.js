import axios from "axios";

import { API_URL } from "./data";

export const addPMS = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/pms",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const fetchPMS = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/pms",
    headers: {
      Authorization: "Bearer" + token,
    },
  });
  return response.data;
};

export const fetchUserPMS = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/pms/" + id, // Append id to the URL
  });
  return response.data;
};

export const deleteUserPMS = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/pms/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteUserPMSAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/pms/admin/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const updateUserPMS = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/pms/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};
