import {createBaseRequest} from '@/apis/base.js'

const base_url = import.meta.env.VITE_BASE_API;
const base_req = createBaseRequest(base_url);
/**
 * @param {*} url 请求路径
 * @param {*} param post 参数
 * @param {*} then 接口调用成功返回
 * @param {*} error 接口调用失败返回
 * @param {*} axiosInstance 请求方法
 */
export const postJson = (url, param, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "post",
    url: url,
    data: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * @param {*} url 请求路径
 * @param {*} formData post 参数
 * @param {*} then 接口调用成功返回
 * @param {*} error 接口调用失败返回
 * @param {*} method 请求方法
 * @param {*} axiosInstance 默认使用base_req
 */
export const postFormData = (url, formData, then, error, method = 'post', axiosInstance = base_req) => {
  return axiosInstance({
    method: method,
    url: url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data;charset-utf-8",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
export const putFormData = (url, formData, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "put",
    url: url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data;charset-utf-8",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * 通用get请求
 */
export const get = (url, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * 封装get请求
 */
export const getParams = (url, param, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "get",
    url: url,
    params: param,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * 封装put请求
 */
export const putRequest = (url, param, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "put",
    url: url,
    data: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * 封装delete请求
 */
export const deleteRequest = (url, param, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "delete",
    url: url,
    params: param,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};
/**
 * 封装下载请求
 */
export const downloadFile = (url, param, then, error, axiosInstance = base_req) => {
  return axiosInstance({
    method: "post",
    url: url,
    data: JSON.stringify(param),
    responseType: 'blob',
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    return then(res);
  })
  .catch(() => {
    return error();
  });
};

