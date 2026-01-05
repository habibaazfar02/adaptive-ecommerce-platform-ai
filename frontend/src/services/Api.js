import axios from "axios";
import { BACKEND_BASE_URL } from "./Config";

export const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});