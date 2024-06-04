import axios from "axios";

import { API_URL } from "./data";

export const fetchClients = async (keyword = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/clients?" + (keyword !== "" ? "keyword=" + keyword : ""),
  });
  return response.data;
};

export const fetchPersonalClient = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/clients/studio",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const getClients = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/clients/" + id,
  });
  return response.data;
};

export const addClientImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImage", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clientimage",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("clientImage", file);
    const response = await axios({
      method: "POST",
      url: API_URL + "/uploadClientImage",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const addClientDetails = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/clients",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const updateClient = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/clients/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteClientAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/clients/admin/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
