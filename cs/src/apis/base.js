import axios from "axios";
import {message} from "antd";
// 服务器返回状态码枚举
const responseStatusEnum = {
  400: "请求出错",
  401: "授权失败，请重新登录",
  403: "拒绝访问",
  404: "请求错误,未找到该资源",
  451: "服务端错误",
  500: "服务端错误",
};
const isBlob = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Blob]";
};
const isHTML = (html) => {
  return typeof html === 'string' && html.indexOf('<!DOCTYPE html>') !== -1
}
export const createBaseRequest = (baseURL, isReturnResponse = true) => {
  // 创建一个 Axios 实例
  const baseRequest = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json;charset=utf-8;",
    },
    timeout: 20000,
    validateStatus(status) {
      return (status >= 200 && status < 300);
    },
  });
  baseRequest.interceptors.request.use(
    (config) => {
      let token = sessionStorage.getItem("token");
      token && (config.headers["Authorization"] = token);
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  baseRequest.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        const data = response.data;
        if (isBlob(data) || isHTML(data) || data.code === 200 || data.code === 0) {
          return isReturnResponse ? response : data;
        } else {
          const errorMsg = data.message || data.msg;
          message.error(errorMsg);
          return Promise.reject(response);
        }
      } else {
        return Promise.reject(response);
      }
    },
    (error) => {
      const {response: errorResponse, config: errorConfig, status: errorStatus} = error;
      const errorMsg = errorResponse?.data?.message || errorResponse?.data?.msg;
      if (errorMsg) {
        message.error(errorMsg);
      } else if (responseStatusEnum[errorStatus] !== undefined) {
        message.error(responseStatusEnum[errorStatus])
      } else if (error?.message === "timeout of 20000ms exceeded") {
        message.error("请求超时");
      } else {
        message.error(`${errorConfig.url} 请求失败`)
      }
      return Promise.reject(errorResponse);
    }
  );
  return baseRequest;
};
