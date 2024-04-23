import axios from "axios";

import { API_URL } from "./data";

export const createOrderPackage = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/orderspackage",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const fetchOrderPackages = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/orderspackage",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const updateOrderPackage = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/orderspackage/" + id,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const deleteOrderPackage = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/orderspackage/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
