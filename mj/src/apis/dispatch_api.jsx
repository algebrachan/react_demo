import { base_url, get, getParams, postJson } from "./instance";

const DISPATCH_PREFIX = `${base_url}/api/dispatch_router`;

// 默认错误处理
const defaultError = (error) => console.error('Dispatch API Error:', error);

// 任务管理
export const appointOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/appoint_one_task`, param, then, error);

export const getTaskList = (then, error = defaultError) => 
  get(`${DISPATCH_PREFIX}/get_task_list`, then, error);

export const getOrderStatus = (then, error = defaultError) => 
  get(`${DISPATCH_PREFIX}/get_order_status`, then, error);

// order_code
export const getOperationInfos = (param, then, error = defaultError) => 
  getParams(`${DISPATCH_PREFIX}/get_operation_infos`, param, then, error);

// 任务操作
export const confirmOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/confirm_one_task`, param, then, error);

export const receiveOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/receive_one_task`, param, then, error);

export const finishOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/finish_one_task`, param, then, error);

export const reportOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/report_one_task`, param, then, error);

export const closeOneTask = (param, then, error = defaultError) => 
  postJson(`${DISPATCH_PREFIX}/close_one_task`, param, then, error);
