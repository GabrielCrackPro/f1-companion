import axios, { AxiosInstance } from "axios";
import { Settings } from "../constants";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: Settings.API_BASE_URL,
});
