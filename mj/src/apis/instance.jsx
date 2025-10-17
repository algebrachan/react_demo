import axios from "axios";
import { getSession } from "../utils/storage";
// axios.defaults.timeout = 20000; // timeout ms

let base_url = import.meta.env.VITE_BASE_API;
let base_ws = import.meta.env.FDC_WS_API;

export { base_url, base_ws };
/**
 * @param {*} url 请求路径
 * @param {*} param post 参数
 * @param {*} then 接口调用成功返回
 * @param {*} error 接口调用失败返回
 */
export const postJson = (url, param, then, error) => {
  const token = getSession("token");
  axios({
    method: "post",
    url: url,
    data: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => {
      then(res);
    })
    .catch(() => {
      error();
    });
};

/**
 * @param {*} url 请求路径
 * @param {*} param post 参数
 * @param {*} then 接口调用成功返回
 * @param {*} error 接口调用失败返回
 */
export const postFormData = (url, formData, then, error) => {
  const token = getSession("token");
  axios({
    method: "post",
    url: url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data;charset-utf-8",
      Authorization: token,
    },
  })
    .then((res) => {
      then(res);
    })
    .catch(() => {
      error();
    });
};

/**
 * 通用get请求
 */
export const get = (url, then, error) => {
  const token = getSession("token");
  axios({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => {
      then(res);
    })
    .catch(() => {
      error();
    });
};
/**
 * 封装get请求
 */
export const getParams = (url, param, then, error) => {
  const token = getSession("token");
  axios({
    method: "get",
    url: url,
    params: param,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => {
      then(res);
    })
    .catch(() => {
      error();
    });
};

export const downloadFile = (url, param, then, error) => {
  const token = getSession("token");
  axios({
    method: "post",
    url: url,
    data: JSON.stringify(param),
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => {
      then(res);
    })
    .catch(() => {
      error();
    });
};
