import axios from "axios";
import { API_URL } from "./data";

export const loginUser = async (data) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/users",
  });
  return response.data;
};

export const addProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/image",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadimage",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/users/" + id,
  });
  return response.data;
};

export const updateUser = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/users/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/auth/addStaff",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};
