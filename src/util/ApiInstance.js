import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { baseURL, secretKey } from "./config";
import { setToast } from "./toastServices";
import { createSelector } from "reselect";

const selectStates = (state) => state;

export const isLoading = createSelector(selectStates, (state) => {
  const slices = Object.values(state);
  const loading = slices.some((slice) => {
    if (
      typeof slice === "object" &&
      slice !== null &&
      slice.isLoading === true
    ) {
      return true;
    }
    return false;
  });
  return loading;
});


// const getTokenData = (): string | null => localStorage.getItem("token");
const getTokenData = () => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const apiInstance = axios.create({
  baseURL,
  headers: {
    secretKey,
    "Content-Type": "application/json",
  },
});

const cancelTokenSource = axios.CancelToken.source();
const token= getTokenData();

axios.defaults.headers.common["Authorization"] = token ? `${token}` : "";
axios.defaults.headers.common["key"] = secretKey;

apiInstance.interceptors.request.use(
  (config) => {
    config.cancelToken = cancelTokenSource.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;

    // Check for 500 or 403 status codes
    if (error.response?.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      axios.defaults.headers.common["key"] = "";
      axios.defaults.headers.common["Authorization"] = "";
      window.location.href = "/";
    }

    if (!errorData) {
      setToast("error", "An unexpected error occurred.");
      return Promise.reject(error);
    }

    if (!errorData.message) {
      setToast("error", "Something went wrong!");
    }

    if (
      errorData.code === "E_USER_NOT_FOUND" ||
      errorData.code === "E_UNAUTHORIZED"
    ) {
      localStorage.clear();
      window.location.reload();
    }

    if (typeof errorData.message === "string") {
      setToast("error", errorData.message);
    } else if (Array.isArray(errorData.message)) {
      errorData.message.forEach((msg) => setToast("error", msg));
    }

    return Promise.reject(error);
  }
);

const handleErrors = async (response) => {
  if (!response.ok) {
    const data = await response.json();

    // Check for 500 or 403 status codes
    if (response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(data);
    }

    if (Array.isArray(data.message)) {
      data.message.forEach((msg) => setToast("error", msg));
    } else {
      setToast("error", data.message || "Unexpected error occurred.");
    }

    return Promise.reject(data);
  }

  return response.json();
};

const getHeaders = ()=> ({
  key: secretKey,
  Authorization: getTokenData() ? `${getTokenData()}` : "",
  "Content-Type": "application/json",
});

export const apiInstanceFetch = {
  baseURL,
  get: (url) =>
    fetch(`${baseURL}${url}`, { method: "GET", headers: getHeaders() }).then(
      handleErrors
    ),

  post: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  patch: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  put: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  delete: (url) =>
    fetch(`${baseURL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleErrors),
};
