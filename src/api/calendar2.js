import axios from "axios";

import { API_URL } from "./data";

// export const fetchCalendars = async (keyword = "") => {
//     const response = await axios({
//         method: "GET",
//         url:
//             API_URL +
//             "/calendars?" +
//             (keyword !== "" ? "keyword=" + keyword : ""),
//     });
//     return response.data;
// };

export const fetchCalendars = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/calendars",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const fetchUserAppointments = async (userId, date) => {
  const response = await axios.get(`/calendars?user=${userId}&date=${date}`);
  return response.data;
};

export const getAppointment = async (id) => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/calendars/" + id,
  });
  return response.data;
};

export const addCalendar = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/calendars",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const updateCalendar = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/calendars/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteAppointment = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/calendars/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
