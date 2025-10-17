import {
  getParams,
  get,
  postJson,
  postFormData,
  downloadFile,
} from "./instance";
// review_id
export const qmsGetReviewsStatus = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/status`;
  getParams(url, param, then, error);
};
export const getUsersMap = (then, error) => {
  const url = `/api/nc_review_router/get_users_map`;
  get(url, then, error);
};
export const qmsNoReview1 = (formData, then, error) => {
  const url = `/api/nc_review_router/reviews/step2`;
  postFormData(url, formData, then, error);
};
export const qmsGetReviews = (param, then, error) => {
  const url = `/api/nc_review_router/get_review`;
  getParams(url, param, then, error);
};
export const taskModelOption = (then, error) => {
  const url = `/api/spc_alarm_router/task_model_option`;
  getParams(url, {}, then, error);
};
export const taskOption = (then, error) => {
  const url = `/api/spc_alarm_router/task_options`;
  getParams(url, {}, then, error);
};
export const qmsNoReview2 = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step3`;
  postJson(url, param, then, error);
};
export const qmsBackToStep2 = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/back_to_step2`;
  postJson(url, param, then, error);
};
export const qmsNoReview2Total = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step3/final_result`;
  postJson(url, param, then, error);
};
export const qmsNoReviewQm = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step4/qm_approval`;
  postJson(url, param, then, error);
};
export const qmsNoReviewVp = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step4/vp_approval`;
  postJson(url, param, then, error);
};
export const qmsNoReview4 = (formData, then, error) => {
  const url = `/api/nc_review_router/reviews/step5`;
  postFormData(url, formData, then, error);
};
export const qmsNoReview5 = (formData, then, error) => {
  let url = `/api/nc_review_router/reviews/step6`;
  postFormData(url, formData, then, error);
};
export const qmsDccFileUrl = (param, then, error) => {
  const url = `/api/dcc_router/get_file_url`;
  getParams(url, param, then, error);
};
export const qmsDccUserDepartment = (then, error) => {
  const url = `/api/dcc_router/get_user_department`;
  get(url, then, error);
};
// process_id
export const qmsDccGetProcess = (param, then, error) => {
  const url = `/api/dcc_router/get_process`;
  getParams(url, param, then, error);
};
export const qmsDccFilterProcess = (param, then, error) => {
  const url = `/api/dcc_router/filter_process`;
  postJson(url, param, then, error);
};
// 内容审核
export const qmsDccApproveContent = (param, then, error) => {
  const url = `/api/dcc_router/approve_content`;
  postJson(url, param, then, error);
};
// 格式卡控
export const qmsDccApproveFormat = (param, then, error) => {
  const url = `/api/dcc_router/approve_format`;
  postJson(url, param, then, error);
};
// 合规性审核
export const qmsDccApproveCompliance = (param, then, error) => {
  const url = `/api/dcc_router/approve_compliance`;
  postJson(url, param, then, error);
};
// 批准
export const qmsDccApproveFinal = (param, then, error) => {
  const url = `/api/dcc_router/approve_final`;
  postJson(url, param, then, error);
};
//会签
export const qmsDccApproveSignature = (param, then, error) => {
  const url = `/api/dcc_router/approve_signature`;
  postJson(url, param, then, error);
};
export const qmsDccSignAxterDocs = (param, then, error) => {
  const url = `/api/dcc_router/sign_exter_docs`;
  postJson(url, param, then, error);
};
export const qmsDccCloseProcess = (param, then, error) => {
  const url = `/api/dcc_router/close_process`;
  postJson(url, param, then, error);
};
export const qmsDccGetFileList = (param, then, error) => {
  const url = `/api/dcc_router/get_file_list`;
  postJson(url, param, then, error);
};
export const qmsDccControlFile = (param, then, error) => {
  const url = `/api/dcc_router/control_file`;
  postJson(url, param, then, error);
};
export const qmsDccGetFilesUrl = (param, then, error) => {
  const url = `/api/dcc_router/get_files_url`;
  postJson(url, param, then, error);
};
export const qmsDccUploadTrainingRecords = (formData, then, error) => {
  const url = `/api/dcc_router/upload_training_records`;
  postFormData(url, formData, then, error);
};
export const spcAlarmAbnornalData = (param, then, error) => {
  const url = `/api/spc_alarm_router/alarm_info`;
  postJson(url, param, then, error);
};
export const spcDelAlarmAbnornalData = (param, then, error) => {
  const url = `/api/spc_alarm_router/Del_Abornamal_Data`;
  postJson(url, param, then, error);
};
export const spcCreateTask = (param, then, error) => {
  const url = `/api/spc_alarm_router/Create_task`;
  postJson(url, param, then, error);
};
export const spcReadTask = (then, error) => {
  const url = `/api/spc_alarm_router/read_task`;
  get(url, then, error);
};
export const spcGetTask = (param, then, error) => {
  const url = `/api/spc_alarm_router/get_task`;
  postJson(url, param, then, error);
};
export const spcCreateCraftTask = (param, then, error) => {
  const url = `/api/spc_alarm_router/create_craft_task`;
  postJson(url, param, then, error);
};
// number
export const allChangeInfo = (param, then, error) => {
  const url = `/api/project_changes/all_change_info`;
  getParams(url, param, then, error);
};
export const downloadMeasuringTools = (param, then, error) => {
  const url = `/api/project_changes/download_measuring_tools`;
  getParams(url, param, then, error);
};
export const changeProcess = (param, then, error) => {
  const url = `/api/project_changes/change_process`;
  postJson(url, param, then, error);
};
export const getNickName = (then, error) => {
  const url = `/api/layered_audit/nick_name`;
  postJson(url, {}, then, error);
};
export const readTaskModel = (param, then, error) => {
  const url = `/api/spc_alarm_router/read_task_model`;
  postJson(url, param, then, error);
};
export const createTaskModel = (param, then, error) => {
  const url = `/api/spc_alarm_router/create_task_model`;
  postJson(url, param, then, error);
};
export const updateTaskModel = (param, then, error) => {
  const url = `/api/spc_alarm_router/update_task_model`;
  postJson(url, param, then, error);
};
export const delTaskModel = (param, then, error) => {
  const url = `/api/spc_alarm_router/del_task_model`;
  postJson(url, param, then, error);
};
export const createInspectionTask = (param, then, error) => {
  const url = `/api/quality_router/create_inspection_task`;
  postJson(url, param, then, error);
};
export const delInspectionTask = (param, then, error) => {
  const url = `/api/quality_router/del_inspection_task`;
  postJson(url, param, then, error);
};
export const qmsReportError = (param, then, error) => {
  const url = `/api/quality_router/report_error`;
  postJson(url, param, then, error);
};
export const getUserMessage = (then, error) => {
  const url = `/api/msg_router/get_user_messages`;
  get(url, then, error);
};
export const handleUserMessage = (param, then, error = () => {}) => {
  const url = `/api/msg_router/handle_user_message`;
  postJson(url, param, then, error);
};
export const createFileCode = (param, then, error = () => {}) => {
  const url = `/api/dcc_router/create_file_code`;
  postJson(url, param, then, error);
};
export const qmsReportPrinting = (param, then, error = () => {}) => {
  const url = `/api/ship_router/report_printing`;
  downloadFile(url, param, then, error);
};

export const commonUploadFile = (formData, then, error) => {
  const url = `/api/file_operation/upload_file`;
  postFormData(url, formData, then, error);
};
