import axios from "axios";
import { message } from "antd";
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
const createBaseRequest = (baseURL) => {
  const baseRequest = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json;charset=utf-8;",
    },
    timeout: 100000000,
    validateStatus(status) {
      responseStatusEnum[status] && message.error(responseStatusEnum[status]);
      return (status >= 200 && status < 300) || status === 451;
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
    async (response) => {
      if (response.status == 200) {
        let data = response.data;
       
        if (Object.prototype.toString.call(data) === "[object Blob]") {
          if (data.type === "application/json") {
            let newData = await new Response(data).json();
            if (newData.code == 401) {
              message.error(newData.msg);
              // logout(false, store, { router });
            } else {
              message.error(newData.msg);
              return Promise.reject(response);
            }
          } else {
            return data;
          }
        } else if (data.code == 200) {
          return data;
        } else if (data.code == 401) {
          message.error(data.msg);
          // logout(false, store, { router });
        } else {
          console.log(data.msg)
          message.error(data.msg);
          return Promise.reject(response);
        }
      } else {
        return Promise.reject(response);
      }
    },
    (error) => {
      if (error.message && error.message === "timeout of 10000ms exceeded") {
        message.error("请求超时");
      }
      return Promise.reject(error.response);
    }
  );
  return baseRequest;
};
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
      let token = sessionStorage.getItem("rms_token");
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

const rms_url = import.meta.env.VITE_RMS_API;
const baseRequest = rmsCreateBaseRequest(rms_url);

// 登录
export function LoginDecryption(params) {
  return baseRequest.post(
    "/api/Account/LoginDecryption",
    params
  );
}

// 设备类型 新增
export function createDeviceType(params) {
  return baseRequest.post(
    "/api/Device/AddDeviceTypeInfo",
    params
  );
}

// 设备类型 查询
export function readDeviceType(params) {
  return baseRequest.post(
    "/api/Device/GetDeviceTypeInfos",
    params
  );
}

// 设备类型 修改
export function updateDeviceType(params) {
  return baseRequest.post(
    "/api/Device/ModifyDeviceTypeInfo",
    params
  );
}

// 设备类型 删除
export function deleteDeviceType(params) {
  return baseRequest.post(
    "/api/Device/DeleteDeviceTypeInfo",
    params
  );
}

// 设备分组 新增
export function createDeviceGroup(params) {
  return baseRequest.post(
    "/api/DeviceGroup/AddDeviceGroupInfo",
    params
  );
}

// 设备分组 查询
export function readDeviceGroup(params) {
  return baseRequest.post(
    "/api/DeviceGroup/GetDeviceGroupInfos",
    params
  );
}

// 设备分组 修改
export function updateDeviceGroup(params) {
  return baseRequest.post(
    "/api/DeviceGroup/ModifyDeviceGroupInfo",
    params
  );
}

// 设备分组 删除
export function deleteDeviceGroup(params) {
  return baseRequest.post(
    "/api/DeviceGroup/DeleteDeviceGroupInfo",
    params
  );
}

// 设备台账 新增
export function createDevice(params) {
  return baseRequest.post(
    "/api/Device/AddDeviceInfo",
    params
  );
}

// 设备台账 查询
export function readDevice(params) {
  return baseRequest.post(
    "/api/Device/GetDeviceInfos",
    params
  );
}

// 设备台账 修改
export function updateDevice(params) {
  return baseRequest.post(
    "/api/Device/ModifyDeviceInfo",
    params
  );
}

// 设备台账 删除
export function deleteDevice(params) {
  return baseRequest.post(
    "/api/Device/DeleteDeviceInfo",
    params
  );
}

// 片区信息 查询
export function getAreas(params) {
  return baseRequest.post(
    "/api/Device/GetAreas",
    params
  );
}

// 配方模板 新增
export function createRecipeTemplate(params) {
  return baseRequest.post(
    "/api/RecipeTemplate/AddRecipeTemplateInfo",
    params
  );
}

// 配方模板 查询
export function readRecipeTemplate(params) {
  return baseRequest.post(
    "/api/RecipeTemplate/GetRecipeTemplateInfos",
    params
  );
}

// 配方模板 修改
export function updateRecipeTemplate(params) {
  return baseRequest.post(
    "/api/RecipeTemplate/ModifyRecipeTemplateInfo",
    params
  );
}

// 配方模板 删除
export function deleteRecipeTemplate(params) {
  return baseRequest.post(
    "/api/RecipeTemplate/DeleteRecipeTemplateInfo",
    params
  );
}

// 配方模板 导出
export function exportRecipeTemplateFile(params) {
  return baseRequest.post(
    "/api/RecipeTemplate/GetRecipeTemplateFile",
    params
  );
}

// 配方组 新增
export function createRecipeGroup(params) {
  return baseRequest.post(
    "/api/RecipeGroup/AddRecipeGroupInfo",
    params
  );
}

// 配方组 查询
export function readRecipeGroup(params) {
  return baseRequest.post(
    "/api/RecipeGroup/GetRecipeGroupInfos",
    params
  );
}

// 配方组 修改
export function updateRecipeGroup(params) {
  return baseRequest.post(
    "/api/RecipeGroup/ModifyRecipeGroupInfo",
    params
  );
}

// 配方组 删除
export function deleteRecipeGroup(params) {
  return baseRequest.post(
    "/api/RecipeGroup/DeleteRecipeGroupInfo",
    params
  );
}

// 配方组 获取未绑定设备
export function readUnboundDeviceList(params) {
  return baseRequest.post(
    "/api/RecipeGroup/GetCanSelectDeviceIds",
    params
  );
}

// 配方文件 新增
export function createRecipeFile(params) {
  return baseRequest.post(
    "/api/Recipe/AddRecipeFileInfo",
    params
  );
}

// 配方文件 编辑
export function updateRecipeFile(params) {
  return baseRequest.post(
    "/api/Recipe/ReplaceFile",
    params
  );
}

// 配方文件 查询
export function readRecipeDocList(params) {
  return baseRequest.post(
    "/api/Recipe/GetRecipeFileInfos",
    params
  );
}

// 配方文件 删除
export function deleteRecipeFile(params) {
  return baseRequest.post(
    "/api/Recipe/DeleteRecipeFileInfo",
    params
  );
}

// 配方文件 导出
export function exportRecipeFile(params) {
  return baseRequest.post(
    "/api/Recipe/GetRecipeFile",
    params
  );
}

// 配方文件 下发
export function deliveryRecipeFile(params) {
  return baseRequest.post(
    "/api/Recipe/CommonIssue",
    params
  );
}

// 获取配方总览实时数据
export function getDeviceRealtimeList(params) {
  return baseRequest.post(
    "/api/RealData/GetDeviceRealInfos",
    params
  );
}
// 获取报警类型
export function GetRecordTypes(params) {
  return baseRequest.post(
    "/api/Log/GetRecordTypes",
    params
  );
}
// 记录一条日志
export function AddLog(params) {
  return baseRequest.post(
    "/api/Log/Add",
    params
  );
}
// 获取报警信息分页
export function GetLog(params) {
  return baseRequest.post(
    "/api/Log/Get",
    params
  );
}

// 获取报警信息校验
export function getDeviceHistoryAlarmList(params) {
  return baseRequest.post(
    "/api/Log/RecipeIsCorrectHistoryInfo",
    params
  );
}

export function getDeviceRealAlarmList(params) {
  return baseRequest.post(
    "/api/Log/RecipeIsCorrectInfo",
    params
  );
}

export function GetFigurecodeenum(params) {
  return baseRequest.post(
    "/api/Interface_MJ/GetFigurecodeenum",
    params
  );
}
export function GetProductionStepEnum(params) {
  return baseRequest.post(
    "/api/Interface_MJ/GetProductionStepEnum",
    params
  );
}
export function BindExtendInfo_MJ(params) {
  return baseRequest.post(
    "/api/Interface_MJ/BindExtendInfo_MJ",
    params
  );
}

// export function BindExtendInfo_MJ(params) {
//   return baseRequest.post(
//     "/api/Interface_MJ/BindExtendInfo_MJ",
//     params
//   );
// }
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





