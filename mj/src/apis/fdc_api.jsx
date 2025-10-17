import { base_url, getParams, get, postJson } from "./instance";

// let base_url = "http://" + window.base_fdc;

export const getFdcDeviceCondition = (then, error) => {
  const url = base_url + `/api/home_analysis/get_device_condition`;
  get(url, then, error);
};
// factory  workshop    process
export const getFdcDevice = (param, then, error) => {
  const url = base_url + `/api/home_analysis/get_device`;
  getParams(url, param, then, error);
};
export const getFdcAbnormalData = (param, then, error) => {
  const url = base_url + `/api/home_analysis/get_abnormal_data`;
  postJson(url, param, then, error);
};

// 设备管理
export const getDeviceSearch = (then, error) => {
  const url = base_url + `/api/device_router/get_device_search`;
  get(url, then, error);
};
export const getDeviceByConditions = (param, then, error) => {
  const url = base_url + `/api/device_router/get_device_by_conditions`;
  postJson(url, param, then, error);
};
export const createDevice = (param, then, error) => {
  const url = base_url + `/api/device_router/create_device`;
  postJson(url, param, then, error);
};
export const updateDevice = (param, then, error) => {
  const url = base_url + `/api/device_router/update_device`;
  postJson(url, param, then, error);
};
export const deleteDevice = (param, then, error) => {
  const url = base_url + `/api/device_router/delete_device`;
  postJson(url, param, then, error);
};
// 参数管理(点位)
export const getPointSearch = (then, error) => {
  const url = base_url + `/api/pointPosition_router/get_devices_info`;
  get(url, then, error);
};

export const readPointPosition = (param, then, error) => {
  const url = base_url + `/api/pointPosition_router/read_pointPosition`;
  postJson(url, param, then, error);
};

export const createPointPosition = (param, then, error) => {
  const url = base_url + `/api/pointPosition_router/create_pointPosition`;
  postJson(url, param, then, error);
};

export const updatePointPosition = (param, then, error) => {
  const url = base_url + `/api/pointPosition_router/update_pointPosition`;
  postJson(url, param, then, error);
};

export const deletePointPosition = (param, then, error) => {
  const url = base_url + `/api/pointPosition_router/delete_pointPosition`;
  postJson(url, param, then, error);
};

// 规则
export const getSearchPara = (then, error) => {
  const url = base_url + `/api/abnormalRule_router/get_search_para`;
  get(url, then, error);
};
export const createAbnormalRule = (param, then, error) => {
  const url = base_url + `/api/abnormalRule_router/create_abnormal_rule`;
  postJson(url, param, then, error);
};
export const getAbnormalRules = (param, then, error) => {
  const url = base_url + `/api/abnormalRule_router/get_abnormal_rules`;
  postJson(url, param, then, error);
};
export const updateAbnormalRule = (param, then, error) => {
  const url = base_url + `/api/abnormalRule_router/update_abnormal_rule`;
  postJson(url, param, then, error);
};
export const deleteAbnormalRule = (param, then, error) => {
  const url = base_url + `/api/abnormalRule_router/delete_abnormal_rule`;
  postJson(url, param, then, error);
};

// 多过程分析
export const getQueryCriteria = (then, error) => {
  const url = base_url + `/api/process_analysis/get_query_criteria`;
  get(url, then, error);
};
// device_id=54
export const getProcessDevice = (param, then, error) => {
  const url = base_url + `/api/process_analysis/get_device`;
  getParams(url, param, then, error);
};

export const getProcessData = (param, then, error) => {
  const url = base_url + `/api/process_analysis/get_process_data`;
  postJson(url, param, then, error);
};
export const getProcessAnalysisData = (param, then, error) => {
  const url = base_url + `/api/process_analysis/get_process_analysis_data`;
  postJson(url, param, then, error);
};
export const postSpeDatasZz = (param, then, error) => {
  const url = base_url + `/api/spc_melt_room_router/post_spe_datas_zz`;
  postJson(url, param, then, error);
};
