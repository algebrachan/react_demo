import { base_url, postJson } from "./instance";

const OCAP_PREFIX = `${base_url}/api/ocap_router`;

// 默认错误处理
const defaultError = (error) => console.error('OCAP API Error:', error);

// 警告和状态相关API
export const getOcapWarningList = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_warning_list`, param, then, error);

export const getProcessStatus = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_process_status`, param, then, error);

// 批号管理相关API
export const getLotnumberList = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_lotnumber_list`, param, then, error);

export const lotnumberLevelUp = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/lotnumber_level_up`, param, then, error);

export const handleLotnumber = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/handle_lotnumber`, param, then, error);

// 原因分析相关API
export const getReasonAnalysis = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_reason_analysis`, param, then, error);

export const addReasonAnlsDepartment = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/add_reason_analysis_department`, param, then, error);

export const submitReasonAnalysis = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/submit_reason_analysis`, param, then, error);

// 原因分类相关API
export const getReasonClassification = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_reason_classification`, param, then, error);

export const addReasonClassification = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/add_reason_classification`, param, then, error);

export const editReasonClassification = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/edit_reason_classification`, param, then, error);

export const deleteReasonClassification = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/delete_reason_classification`, param, then, error);

// 对策管理相关API
export const getCountermeasure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/get_countermeasure`, param, then, error);

export const addCountermeasure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/add_countermeasure`, param, then, error);

export const editCountermeasure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/edit_countermeasure`, param, then, error);

export const deleteCountermeasure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/delete_countermeasure`, param, then, error);

// 确认流程相关API
export const confirmCountermeasure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/confirm_countermeasure`, param, then, error);

export const confirmImplementation = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/confirm_implementation`, param, then, error);

export const qualityConfirmation = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/quality_confirmation`, param, then, error);

export const confirmClosure = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/confirm_closure`, param, then, error);


export const exportAnomalyReport = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/export_anomaly_report`, param, then, error);

// 专单关闭
export const closeZhuandan = (param, then, error = defaultError) =>
  postJson(`${OCAP_PREFIX}/close_zhuandan`, param, then, error);



