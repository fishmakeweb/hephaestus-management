import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.hephaestus.store/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
