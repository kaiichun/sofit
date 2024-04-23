import axios from "axios";

import { API_URL } from "./data";

export const fetchWages = async () => {
  const response = await axios.get(API_URL + "/wage");
  return response.data;
};

export const getWage = async (id) => {
  const response = await axios.get(API_URL + "/wage/" + id);
  return response.data;
};

export const addWage = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/wage",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const updateWage = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/wage/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteWage = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/wage/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
