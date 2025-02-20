import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./ApiUrls";

axios.defaults.baseURL = BASE_URL;

const createHeader = (_URL: string, options = {}) => {
  const header = {
    Accept: "/",
    Authorization: "Bearer " + localStorage.getItem("accessToken"),
  };
  options = { ...options, headers: header };
  return { URL: _URL, options: options };
};

const POST = <T, R>(
  _URL: string,
  data: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _options?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<R, any>> => {
  const { URL, options } = createHeader(_URL, _options);
  return axios.post(URL, data, options);
};

const GET = <R>(
  _URL: string,
  _options?: RequestInit
): Promise<AxiosResponse<R>> => {
  const { URL, options } = createHeader(_URL, _options);
  return axios.get(URL, options);
};

const PATCH = <T, R>(
  _URL: string,
  data: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _options?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<R | any, any>> => {
  const { URL, options } = createHeader(_URL, _options);
  return axios.patch(URL, data, options);
};

const PUT = <T, R>(
  _URL: string,
  data: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _options?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<R | any, any>> => {
  const { URL, options } = createHeader(_URL, _options);
  return axios.put(URL, data, options);
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const DELETE = <R>(_URL: string, _options?: any): Promise<AxiosResponse<R>> => {
  const { URL, options } = createHeader(_URL, _options);
  return axios.delete(URL, options);
};

const GET_AUTH_TOKEN = () => {
  return localStorage.getItem("accessToken");
};

export { POST, GET, PUT, PATCH, DELETE, GET_AUTH_TOKEN };
