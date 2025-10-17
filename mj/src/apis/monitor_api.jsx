import { base_url, get, postJson } from "./instance";

const MONITOR_PREFIX = `${base_url}/api/monitor_router`;

// 默认错误处理
const defaultError = (error) => console.error('Monitor API Error:', error);

// 熔体监控相关API
export const getMeltMonitor = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_melt_monitor`, param, then, error);

export const addMeltMonitor = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/add_melt_monitor`, param, then, error);

export const deleteMeltMonitor = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/delete_melt_monitor`, param, then, error);

export const updateMeltMonitor = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/update_melt_monitor`, param, then, error);

// 熔体监控记录相关API
export const getMeltMonitorRecord = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_melt_monitor_record`, param, then, error);

export const addMeltMonitorRecord = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/add_melt_monitor_record`, param, then, error);

export const deleteMeltMonitorRecord = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/delete_melt_monitor_record`, param, then, error);

export const updateMeltMonitorRecord = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/update_melt_monitor_record`, param, then, error);

// 数据报告和最新记录
export const getDataReport = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_data_report`, param, then, error);

export const getLatestMeltMonitorRecord = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_latest_melt_monitor_record`, param, then, error);

export const getLatestMeltMonitor = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_latest_melt_monitor`, param, then, error);

// 监控选项
export const getMonitorOptions = (then, error = defaultError) =>
  get(`${MONITOR_PREFIX}/get_monitor_options`, then, error);

export const addMonitorOptions = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/add_monitor_options`, param, then, error);

// 投料数据
export const getTouliaoData = (param, then, error = defaultError) =>
  postJson(`${MONITOR_PREFIX}/get_touliao_data`, param, then, error);
