import axios from "axios";

import { API_URL } from "./data";

export const fetchPackage = async () => {
  const response = await axios.get(API_URL + "/packages");
  return response.data;
};

export const getPackage = async (id) => {
  const response = await axios.get(API_URL + "/packages/" + id);
  return response.data;
};

export const addPackage = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/packages",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const updatePackage = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/packages/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deletePackage = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/packages/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
