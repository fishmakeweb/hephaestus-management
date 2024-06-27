import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.hepheathus.store/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
