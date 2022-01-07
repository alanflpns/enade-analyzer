import axios from "axios";
import { API_URL } from "../constants";

const AxiosApi = axios;
AxiosApi.defaults.baseURL = API_URL;

export default AxiosApi;
