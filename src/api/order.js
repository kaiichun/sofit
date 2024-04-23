import axios from "axios";

import { API_URL } from "./data";

export const createOrder = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/orders",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const fetchOrders = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/orders",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const updateOrder = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/orders/" + id,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const deleteOrder = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/orders/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
