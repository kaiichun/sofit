// export const API_URL = "http://localhost:2019";

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:2019"
    : "https://api.sofitadmin.com";
