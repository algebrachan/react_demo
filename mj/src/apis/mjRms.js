import axios from "axios";
import { message } from "antd";
import { getSession } from "../utils/storage";

// 服务器返回状态码枚举
const responseStatusEnum = {
  400: "请求出错",
  401: "授权失败，请重新登录",
  403: "拒绝访问",
  404: "请求错误,未找到该资源",
  451: "服务端错误",
  500: "服务端错误",
};
// 创建一个 Axios 实例

const rmsCreateBaseRequest = (baseURL) => {
  const baseRequest = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json;charset=utf-8;",
    },
    timeout: 300000,
    validateStatus(status) {
      return (status >= 200 && status < 300);
    },
  });
  baseRequest.interceptors.request.use(
    (config) => {
      let token =  getSession("token");
      token && (config.headers["Authorization"] = token);
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  baseRequest.interceptors.response.use(
    async (response) => {
      if (response.status == 200) {

        let data = response.data;
        if (Object.prototype.toString.call(data) === "[object Blob]") {
          return data;
        } else if (data.Code === 0 || data.code === 0) {
          return data;
        } else {
          message.error(data.Message);
          return Promise.reject(response);
        }
      } else {
        return Promise.reject(response);
      }
    },
    (error) => {
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        responseStatusEnum[error?.status] && message.error(responseStatusEnum[error?.status]);
        if (error.message && error.message === "timeout of 10000ms exceeded") {
          message.error("请求超时");
        }
      }
      return Promise.reject(error.response);
    }
  );
  return baseRequest;
}

const rms_url = import.meta.env.VITE_BASE_API;
const baseRequest = rmsCreateBaseRequest(rms_url);
// 清洗获取下拉框的参数
export function rms_options(params) {
  return baseRequest.get(
    "/api/recipe_route/api/rms_options",
    params
  );
}
// 清洗创建表单
export function create_recipe(params) {
  return baseRequest.post(
    "/api/recipe_route/create_recipe",
    params
  );
}
// 清洗获取表单
export function read_all_recipes(params) {
  return baseRequest.post(
    "/api/recipe_route/read_all_recipes",
    params
  );
}

// 清洗更新表格
export function update_recipe(params) {
  return baseRequest.post(
    "/api/recipe_route/update_recipe",
    params
  );
}
// 清洗删除表格
export function delete_recipe(params) {
  return baseRequest.post(
    "/api/recipe_route/delete_recipe",
    params
  );
}

// 石英砂配方计算
export function calculate_quartz_sand_params(params) {
  return baseRequest.post(
    "/api/recipe_route/calculate_quartz_sand_params",
    params
  );
}

// 创建石英砂配方
export function create_quartz_sand_recipe(params) {
  return baseRequest.post(
    "/api/recipe_route/create_quartz_sand_recipe",
    params
  );
}
// 更新石英砂配方
export function update_quartz_sand_recipe(params) {
  return baseRequest.post(
    "/api/recipe_route/update_quartz_sand_recipe",
    params
  );
}


