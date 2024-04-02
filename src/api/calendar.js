import axios from "axios";

import { API_URL } from "./data";

export const addAppointment = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/activity",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addStaffActivity = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/appointment/stafff-activity",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const getClients = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/activity/" + id,
  });
  return response.data;
};

export const fetchClientAppointment = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/activity/" + id,
  });
  return response.data;
};

export const addClientAppointment = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/activity",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const updateClientAppointment = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/activity/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteClientAppointment = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/activity/" + id + "/delete",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteClientAppointmentAdmin = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/activity/" + id + "/delete",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
