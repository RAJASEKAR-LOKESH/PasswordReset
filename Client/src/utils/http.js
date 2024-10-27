import axios from "axios";

const instance = axios.create({
  baseURL: "https://password-reset-3b2j.onrender.com/api",
  timeout: 15000,
});

export default instance;