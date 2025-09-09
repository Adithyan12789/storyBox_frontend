import axios, { AxiosResponse } from "axios";

// Set Token In Axios
export function setToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// Set Key In Axios
export function SetDevKey(key) {
  if (key) {
    axios.defaults.headers.common["key"] = key;
  } else {
    delete axios.defaults.headers.common["key"];
  }
}
