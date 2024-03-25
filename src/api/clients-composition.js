import axios from "axios";

import { API_URL } from "./data";

export const addClientBMI = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/clients-composition",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const fetchClientsBMI = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/clients-composition/" + id,
  });
  return response.data;
};

export const deleteClientBMI = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/clients-composition/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteClientBMIAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/clients-composition/admin/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const addVideo = async (file) => {
  const formData = new FormData();
  formData.append("clientVideo", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clients-composition",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientVideo = async (file) => {
  const formData = new FormData();
  formData.append("clientVideo", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadclientvideo",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const addClientFrontImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageFront", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clientimagefront",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientFrontImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageFront", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadclientimagefront",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const addClientBackImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImagBack", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clientimageback",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientBackImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageBack", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadclientimageback",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const addClientLeftImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImagLeft", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clientimageleft",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientLeftImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageLeft", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadclientimageleft",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};
export const addClientRightImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageRight", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/clientimageright",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const uploadClientRightImage = async (file) => {
  const formData = new FormData();
  formData.append("clientImageRight", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/uploadclientimageright",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const updateClientBmi = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/clients-composition/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};
