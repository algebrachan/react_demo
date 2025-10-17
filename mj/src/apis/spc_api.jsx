import { base_url, getParams, get, postJson, postFormData } from "./instance";

export const getLotnumberList = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_lotnumber_list`;
  postJson(url, param, then, error);
};
export const getInspectionRecord = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_inspection_record`;
  postJson(url, param, then, error);
};
export const getSpcOptions = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_spc_options`;
  postJson(url, param, then, error);
};
export const getSpcResult = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_spc_result`;
  postJson(url, param, then, error);
};
export const getPeriodSpcOptions = (param, then, error) => {
  const url = base_url + `/api/period_anls_router/get_spc_options`;
  postJson(url, param, then, error);
};
export const getPeriodSpcResult = (param, then, error) => {
  const url = base_url + `/api/period_anls_router/get_spc_result`;
  postJson(url, param, then, error);
};
export const getLailiaoSpcOptions = (param, then, error) => {
  const url = base_url + `/api/lailiao_anls_router/get_spc_options`;
  postJson(url, param, then, error);
};
export const getLailiaoSpcResult = (param, then, error) => {
  const url = base_url + `/api/lailiao_anls_router/get_spc_result`;
  postJson(url, param, then, error);
};
export const getSrjcSpcOptions = (param, then, error) => {
  const url = base_url + `/api/srjc_anls_router/get_spc_options`;
  postJson(url, param, then, error);
};
export const getSrjcSpcResult = (param, then, error) => {
  const url = base_url + `/api/srjc_anls_router/get_spc_result`;
  postJson(url, param, then, error);
};
export const getAlarmRecord = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_alarm_record`;
  postJson(url, param, then, error);
};
export const submitStrategy = (param, then, error) => {
  const url = base_url + `/api/spc_router/submit_strategy`;
  postJson(url, param, then, error);
};
export const approveStrategy = (param, then, error) => {
  const url = base_url + `/api/spc_router/approve_strategy`;
  postJson(url, param, then, error);
};
export const rejectStrategy = (param, then, error) => {
  const url = base_url + `/api/spc_router/reject_strategy`;
  postJson(url, param, then, error);
};
export const closeAlarmRecord = (param, then, error) => {
  const url = base_url + `/api/spc_router/close_alarm_record`;
  postJson(url, param, then, error);
};
export const getRecordForm = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_record_form`;
  postJson(url, param, then, error);
};
export const getSpcSpecificationOptions = (then, error) => {
  const url = base_url + `/api/spc_router/get_spc_specification_options`;
  get(url, then, error);
};
export const getSpcSpecification = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_spc_specification1`;
  postJson(url, param, then, error);
};
export const getSpcSpecification2 = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_spc_specification2`;
  postJson(url, param, then, error);
};
export const getSpcSpecification3 = (param, then, error) => {
  const url = base_url + `/api/spc_router/get_spc_specification3`;
  postJson(url, param, then, error);
};
export const addNewSpcSpecification = (param, then, error) => {
  const url = base_url + `/api/spc_router/add_new_spc_specification1`;
  postJson(url, param, then, error);
};
export const addNewSpcSpecification2 = (param, then, error) => {
  const url = base_url + `/api/spc_router/add_new_spc_specification2`;
  postJson(url, param, then, error);
};
export const addNewSpcSpecification3 = (param, then, error) => {
  const url = base_url + `/api/spc_router/add_new_spc_specification3`;
  postJson(url, param, then, error);
};

export const updateSpcSpecification = (param, then, error) => {
  const url = base_url + `/api/spc_router/update_spc_specification1`;
  postJson(url, param, then, error);
};
export const updateSpcSpecification2 = (param, then, error) => {
  const url = base_url + `/api/spc_router/update_spc_specification2`;
  postJson(url, param, then, error);
};
export const updateSpcSpecification3 = (param, then, error) => {
  const url = base_url + `/api/spc_router/update_spc_specification3`;
  postJson(url, param, then, error);
};
export const deleteSpecifications = (param, then, error) => {
  const url = base_url + `/api/spc_router/delete_specifications1`;
  postJson(url, param, then, error);
};
export const deleteSpecifications2 = (param, then, error) => {
  const url = base_url + `/api/spc_router/delete_specifications2`;
  postJson(url, param, then, error);
};
export const deleteSpecifications3 = (param, then, error) => {
  const url = base_url + `/api/spc_router/delete_specifications3`;
  postJson(url, param, then, error);
};
// /api/db_router/upload_spc_file
export const uploadSpcFile = (formData, then, error) => {
  const url = base_url + `/api/db_router/upload_spc_file`;
  postFormData(url, formData, then, error);
};

// 控制线管理
export const getCtrlSpecification = (param, then, error) => {
  const url = base_url + `/api/control_line_router/get_spc_specification`;
  postJson(url, param, then, error);
};
export const addCtrlSpecification = (param, then, error) => {
  const url = base_url + `/api/control_line_router/add_new_spc_specification`;
  postJson(url, param, then, error);
};
export const updateCtrlSpecification = (param, then, error) => {
  const url = base_url + `/api/control_line_router/update_spc_specification`;
  postJson(url, param, then, error);
};
export const deleteCtrlSpecifications = (param, then, error) => {
  const url = base_url + `/api/control_line_router/delete_specifications`;
  postJson(url, param, then, error);
};
