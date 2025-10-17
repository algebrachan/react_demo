import {
  getParams,
  get,
  postJson,
  postFormData,
  putFormData,
  putRequest,
  deleteRequest,
  downloadFile,
} from "./instance";

export const qmsReviews = (param, then, error) => {
  const url = `/api/nc_review_router/reviews`;
  postJson(url, param, then, error);
};
export const qmsGetReviews = (param, then, error) => {
  const url = `/api/nc_review_router/get_review`;
  getParams(url, param, then, error);
};
export const qmsGetReviewStatus = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/status`;
  getParams(url, param, then, error);
};
export const qmsStep2 = (formData, then, error) => {
  const url = `/api/nc_review_router/reviews/step2`;
  postFormData(url, formData, then, error);
};
export const qmsStep3 = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step3`;
  postJson(url, param, then, error);
};
export const qmsStep4ipt = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step4/input`;
  postJson(url, param, then, error);
};
export const qmsStep4confirm = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step4/confirm`;
  postJson(url, param, then, error);
};
export const qmsStep4vp = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step4/vp_sign`;
  postJson(url, param, then, error);
};
export const qmsStep5AddEmptyItem = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step5/add_empty_item`;
  postJson(url, param, then, error);
};
export const qmsStep5EditItem = (formData, then, error) => {
  let url = `/api/nc_review_router/reviews/step5/edit_item`;
  postFormData(url, formData, then, error);
};
export const qmsStep5DeleteItem = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step5/delete_item`;
  postJson(url, param, then, error);
};
export const qmsStep5Confirm = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/step5/confirm`;
  postJson(url, param, then, error);
};
export const qmsStep6 = (formData, then, error) => {
  let url = `/api/nc_review_router/reviews/step6`;
  postFormData(url, formData, then, error);
};
export const qmsManualClose = (param, then, error) => {
  const url = `/api/nc_review_router/reviews/manual_close`;
  postJson(url, param, then, error);
};
export const createReviews = (param, then, error) => {
  const url = `/api/nc_review_router/create_reviews`;
  postJson(url, param, then, error);
};
export const readInspectionReport = (param, then, error) => {
  const url = `/api/quality_router/read_inspection_report`;
  postJson(url, param, then, error);
};
export const readReportLike = (param, then, error) => {
  const url = `/api/quality_router/read_report_like`;
  postJson(url, param, then, error);
};
export const updateInspectionReport = (param, then, error) => {
  const url = `/api/quality_router/update_inspection_report`;
  postJson(url, param, then, error);
};
export const createInspectionReport = (formData, then, error) => {
  const url = `/api/quality_router/create_inspection_report`;
  postFormData(url, formData, then, error);
};
export const addReportFiles = (formData, then, error) => {
  const url = `/api/quality_router/add_report_files`;
  postFormData(url, formData, then, error);
};
export const delReportFile = (param, then, error) => {
  const url = `/api/quality_router/del_report_file`;
  postJson(url, param, then, error);
};
export const inspectionUnqualified = (param, then, error) => {
  const url = `/api/quality_router/unqualified`;
  postJson(url, param, then, error);
};
export const inspectionData = (param, then, error) => {
  const url = `/api/quality_router/inspection_data`;
  postJson(url, param, then, error);
};
// qms-标准管理
export const instructionOptions = (then, error) => {
  const url = `/api/guideline_router/instruction_options`;
  get(url, then, error);
};
export const readInstruction = (param, then, error) => {
  const url = `/api/guideline_router/read_instruction`;
  postJson(url, param, then, error);
};
export const createInstruction = (formData, then, error) => {
  const url = `/api/guideline_router/create_instruction`;
  postFormData(url, formData, then, error);
};
export const updateInstruction = (formData, then, error) => {
  const url = `/api/guideline_router/update_instruction`;
  postFormData(url, formData, then, error);
};
export const readSopInstruction = (param, then, error) => {
  const url = `/api/guideline_router/read_sop_instruction`;
  postJson(url, param, then, error);
};
export const createSopInstruction = (formData, then, error) => {
  const url = `/api/guideline_router/create_sop_instruction`;
  postFormData(url, formData, then, error);
};
export const updateSopInstruction = (formData, then, error) => {
  const url = `/api/guideline_router/update_sop_instruction`;
  postFormData(url, formData, then, error);
};
export const qmsGetNumberInfo = (param, then, error) => {
  const url = `/api/project_changes/get_number_info`;
  getParams(url, param, then, error);
};
export const qmsGetChanges = (param, then, error) => {
  const url = `/api/project_changes/get_changes`;
  getParams(url, param, then, error);
};
export const qmsPutChanges = (param, then, error) => {
  const url = `/api/project_changes/put_changes`;
  postJson(url, param, then, error);
};
export const qmsDelChangeNumber = (param, then, error) => {
  const url = `/api/project_changes/del_change_number`;
  postJson(url, param, then, error);
};
export const qmsPostChangeNumber = (then, error) => {
  const url = `/api/project_changes/post_change_number`;
  postJson(url, {}, then, error);
};
export const qmsPostChanges = (param, then, error) => {
  const url = `/api/project_changes/post_changes`;
  postJson(url, param, then, error);
};
export const qmsGetFeasibilityAssessment = (param, then, error) => {
  const url = `/api/project_changes/get_feasibility_assessment`;
  getParams(url, param, then, error);
};
export const qmsPutFeasibilityAssessment = (param, then, error) => {
  const url = `/api/project_changes/put_feasibility_assessment`;
  postJson(url, param, then, error);
};
export const qmsPostFeasibilityAssessment = (param, then, error) => {
  const url = `/api/project_changes/post_feasibility_assessment`;
  postJson(url, param, then, error);
};
export const qmsGetChangeCountersignature = (param, then, error) => {
  const url = `/api/project_changes/get_change_countersignature`;
  getParams(url, param, then, error);
};
export const qmsPutChangeCountersignature = (param, then, error) => {
  const url = `/api/project_changes/put_change_countersignature`;
  postJson(url, param, then, error);
};
export const qmsPostChangeCountersignature = (param, then, error) => {
  const url = `/api/project_changes/post_change_countersignature`;
  postJson(url, param, then, error);
};
export const qmsGetProcessRequirements = (param, then, error) => {
  const url = `/api/project_changes/get_process_requirements`;
  getParams(url, param, then, error);
};
export const qmsPutProcessRequirements = (formData, then, error) => {
  const url = `/api/project_changes/put_process_requirements`;
  postFormData(url, formData, then, error);
};
export const qmsPostProcessRequirements = (param, then, error) => {
  const url = `/api/project_changes/post_process_requirements`;
  postJson(url, param, then, error);
};
export const qmsGetAcceptance = (param, then, error) => {
  const url = `/api/project_changes/get_acceptance`;
  getParams(url, param, then, error);
};
export const qmsPutAcceptance = (param, then, error) => {
  const url = `/api/project_changes/put_acceptance`;
  postJson(url, param, then, error);
};
export const qmsPostAcceptance = (param, then, error) => {
  const url = `/api/project_changes/post_acceptance`;
  postJson(url, param, then, error);
};
export const qmsGetReport = (param, then, error) => {
  const url = `/api/project_changes/get_report`;
  getParams(url, param, then, error);
};
export const qmsPutReport = (formData, then, error) => {
  const url = `/api/project_changes/put_report`;
  postFormData(url, formData, then, error);
};
export const qmsPostReport = (param, then, error) => {
  const url = `/api/project_changes/post_report`;
  postJson(url, param, then, error);
};
export const qmsSubmitReport = (param, then, error) => {
  const url = `/api/project_changes/submit_report`;
  postJson(url, param, then, error);
};
export const getChangeNotification = (param, then, error) => {
  const url = `/api/project_changes/get_change_order`;
  getParams(url, param, then, error);
};
export const postChangeNotification = (param, then, error) => {
  const url = `/api/project_changes/post_change_order`;
  postJson(url, param, then, error);
};
export const lop_options = (param, then, error) => {
  const url = `/api/lop_router/lop_options`;
  getParams(url, param, then, error);
};
export const read_lop = (param, then, error) => {
  const url = `/api/lop_router/read_lop`;
  postJson(url, param, then, error);
};
export const create_lop = (param, then, error) => {
  const url = `/api/lop_router/create_lop`;
  postJson(url, param, then, error);
};
export const update_lop = (param, then, error) => {
  const url = `/api/lop_router/update_lop`;
  postJson(url, param, then, error);
};
export const delete_lop = (param, then, error) => {
  const url = `/api/lop_router/delete_lop`;
  postJson(url, param, then, error);
};
export const dccFilterFiles = (param, then, error) => {
  const url = `/api/dcc_router/filter_files`;
  postJson(url, param, then, error);
};
export const dccApproveFile = (formData, then, error) => {
  const url = `/api/dcc_router/approve_file`;
  postFormData(url, formData, then, error);
};
export const dccRejectFile = (param, then, error) => {
  const url = `/api/dcc_router/reject_file`;
  postJson(url, param, then, error);
};
export const dccCloseFile = (param, then, error) => {
  const url = `/api/dcc_router/close_file`;
  postJson(url, param, then, error);
};
export const getFileStatus = (param, then, error) => {
  const url = `/api/dcc_router/get_file_status`;
  postJson(url, param, then, error);
};
export const dccSubmitAndStartApproval = (formData, then, error) => {
  let url = `/api/dcc_router/submit_and_start_approval`;
  postFormData(url, formData, then, error);
};
export const dccDownloadFile = (param, then, error) => {
  const url = `/api/dcc_router/download_file`;
  getParams(url, param, then, error);
};
export const dccGetFileStat = (then, error) => {
  const url = `/api/dcc_router/get_file_stat`;
  get(url, then, error);
};
export const getChangePlanTracking = (param, then, error) => {
  const url = `/api/project_changes/get_change_plan_tracking`;
  getParams(url, param, then, error);
};
export const postChangePlanTracking = (param, then, error) => {
  const url = `/api/project_changes/post_change_plan_tracking`;
  postJson(url, param, then, error);
};
// 检测设备管理
export const getToolsLedger = (param, then, error) => {
  const url = `/api/measuring_tools/get_equipment_ledger`;
  postJson(url, param, then, error);
};
export const addToolsLedger = (param, then, error) => {
  const url = `/api/measuring_tools/equipment_ledger`;
  postJson(url, param, then, error);
};
export const editToolsLedger = (param, then, error) => {
  const url = `/api/measuring_tools/equipment_ledger`;
  putRequest(url, param, then, error);
};
export const deleteToolsLedger = (param, then, error) => {
  const url = `/api/measuring_tools/equipment_ledger`;
  deleteRequest(url, param, then, error);
};
export const uploadToolsLedger = (param, formData, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/measuring_tools/upload_measuring_tools?` + params;
  postFormData(url, formData, then, error);
};
export const downloadLedgerReport = (param, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/measuring_tools/download_measuring_tools?` + params;
  downloadFile(url, undefined, then, error);
};
export const addVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/verification_plan`;
  postJson(url, param, then, error);
};
export const getVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/get_verification_plan`;
  postJson(url, param, then, error);
};
export const editVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/verification_plan`;
  putRequest(url, param, then, error);
};
export const deleteVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/verification_plan`;
  deleteRequest(url, param, then, error);
};
export const finishVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/finish_verification_plan`;
  postJson(url, param, then, error);
};
export const cancelVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/cancel_inspection`;
  postJson(url, param, then, error);
};
export const downloadVerificationPlan = (param, then, error) => {
  const url = `/api/measuring_tools/download_verification_plan`;
  downloadFile(url, param, then, error);
};
export const getMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/get_maintenance_plan`;
  postJson(url, param, then, error);
};
export const addMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/maintenance_plan`;
  postJson(url, param, then, error);
};
export const editMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/maintenance_plan`;
  putRequest(url, param, then, error);
};
export const deleteMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/maintenance_plan`;
  deleteRequest(url, param, then, error);
};
export const finishMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/finish_maintenance_plan`;
  postJson(url, param, then, error);
};
export const downloadMaintenancePlan = (param, then, error) => {
  const url = `/api/measuring_tools/download_maintenance_plan`;
  downloadFile(url, param, then, error);
};
// 增加客诉账台
export const customer_complaint = (param, then, error) => {
  const url = `/api/customer_complaint/customer_complaint`;
  postFormData(url, param, then, error);
};
// 修改客诉账台
export const customer_complaint_put = (param, then, error) => {
  const url = `/api/customer_complaint/customer_complaint`;
  putFormData(url, param, then, error);
};
// 删除客诉账台
export const customer_complaint_delete = (param, then, error) => {
  const url = `/api/customer_complaint/customer_complaint`;
  deleteRequest(url, param, then, error);
};
// 查询检测台账
export const get_customer_complaint = (param, then, error) => {
  const url = `/api/customer_complaint/get_customer_complaint`;
  postJson(url, param, then, error);
};
// 发起不合格
export const initiate_nonconformity = (param, then, error) => {
  const url = `/api/customer_complaint/initiate_nonconformity`;
  postFormData(url, param, then, error);
};
// 客诉管理获取搜索条件
export const get_search_data = (param, then, error) => {
  const url = `/api/customer_complaint/get_search_data`;
  postJson(url, param, then, error);
};
// 出货检验
export const qmsShipOptions = (then, error) => {
  const url = `/api/ship_router/ship_options`;
  get(url, then, error);
};
export const qmsReadShipTasks = (param, then, error) => {
  const url = `/api/ship_router/read_ship_tasks`;
  postJson(url, param, then, error);
};
export const qmsCreateShipTasks = (param, then, error) => {
  const url = `/api/ship_router/create_ship_task`;
  postJson(url, param, then, error);
};
export const qmsUpdateShipTasks = (param, then, error) => {
  const url = `/api/ship_router/update_ship_task`;
  postJson(url, param, then, error);
};
export const qmsDeleteShipTasks = (param, then, error) => {
  const url = `/api/ship_router/delete_ship_task`;
  postJson(url, param, then, error);
};
export const qmsReadShipReport = (param, then, error) => {
  const url = `/api/ship_router/read_ship_report`;
  postJson(url, param, then, error);
};
export const qmsCreateShipReport = (param, then, error) => {
  const url = `/api/ship_router/create_ship_report`;
  postJson(url, param, then, error);
};
export const qmsReadShipReportLike = (param, then, error) => {
  const url = `/api/ship_router/read_ship_report_like`;
  postJson(url, param, then, error);
};
// 增加分层审核
export const layered_audit_plan = (param, then, error) => {
  const url = `/api/layered_audit/layered_audit_plan`;
  postJson(url, param, then, error);
};
// 修改分层审核
export const layered_audit_plan_put = (param, then, error) => {
  const url = `/api/layered_audit/layered_audit_plan`;
  putRequest(url, param, then, error);
};
// 删除分层审核
export const layered_audit_plan_delete = (param, then, error) => {
  const url = `/api/layered_audit/layered_audit_plan`;
  deleteRequest(url, param, then, error);
};
// 获取分层审核
export const get_layered_audit_plan = (param, then, error) => {
  const url = `/api/layered_audit/get_layered_audit_plan`;
  postJson(url, param, then, error);
};
// 增加审核内容
export const audit_content = (param, then, error) => {
  const url = `/api/layered_audit/audit_content`;
  postJson(url, param, then, error);
};
// 修改审核内容
export const audit_content_put = (param, then, error) => {
  const url = `/api/layered_audit/audit_content`;
  putRequest(url, param, then, error);
};
// 删除审核内容
export const audit_content_delete = (param, then, error) => {
  const url = `/api/layered_audit/audit_content`;
  deleteRequest(url, param, then, error);
};
// 获取审核内容
export const get_audit_content = (param, then, error) => {
  const url = `/api/layered_audit/audit_content`;
  getParams(url, param, then, error);
};
// 增加不符合项
export const non_conform = (param, then, error) => {
  const url = `/api/layered_audit/non_conform`;
  postFormData(url, param, then, error);
};
// 修改不符合项
export const non_conform_put = (param, then, error) => {
  const url = `/api/layered_audit/non_conform`;
  putFormData(url, param, then, error);
};
// 删除不符合项
export const non_conform_delete = (param, then, error) => {
  const url = `/api/layered_audit/non_conform`;
  deleteRequest(url, param, then, error);
};
// 获取不符合项
export const get_non_conform = (param, then, error) => {
  const url = `/api/layered_audit/get_non_conform`;
  getParams(url, param, then, error);
};
// 获取不符合项查询
export const get_non_conform_search = (param, then, error) => {
  const url = `/api/layered_audit/non_conform_data`;
  getParams(url, param, then, error);
};
// 上传文件信息
export const upload_non_conform = (param, then, error) => {
  const url = `/api/layered_audit/upload_non_conform`;
  postJson(url, param, then, error);
};
// 下载文件信息
export const download_measuring_tools = (param, then, error) => {
  const url = `/api/layered_audit/download_measuring_tools`;
  postJson(url, param, then, error);
};
// 增加产品
export const product_post = (param, then, error) => {
  const url = `/api/customer_complaint/product`;
  postJson(url, param, then, error);
};
// 修改产品
export const product_put = (param, then, error) => {
  const url = `/api/customer_complaint/product`;
  putRequest(url, param, then, error);
};
// 删除产品
export const product_delete = (param, then, error) => {
  const url = `/api/customer_complaint/del_product`;
  postJson(url, param, then, error);
};
// 获取产品
export const product_get = (param, then, error) => {
  const url = `/api/customer_complaint/product`;
  getParams(url, param, then, error);
};
// 体系内审，获取年度审核方案
export const read_audit_plan = (param, then, error) => {
  const url = `/api/system_audit_router/read_audit_plan`;
  getParams(url, param, then, error);
};
// 体系内审，创建年度审核方案
export const create_audit_plan = (param, then, error) => {
  const url = `/api/system_audit_router/create_audit_plan`;
  postJson(url, param, then, error);
};
// 体系内审，更新年度审核方案
export const update_audit_plan = (param, then, error) => {
  const url = `/api/system_audit_router/update_audit_plan`;
  postJson(url, param, then, error);
};
// 体系内审，更新年度审核方案
export const delete_audit_plan = (param, then, error) => {
  const url = `/api/system_audit_router/delete_audit_plan`;
  postJson(url, param, then, error);
};
// 体系内审，获取实施计划
export const read_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/read_review_plan`;
  postJson(url, param, then, error);
};
// 体系内审，新增实施计划
export const create_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/create_review_plan`;
  postJson(url, param, then, error);
};
// 体系内审，更新实施计划
export const update_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/update_review_plan`;
  postJson(url, param, then, error);
};
// 体系内审，获取流程状态
export const get_task_status = (param, then, error) => {
  const url = `/api/system_audit_router/get_task_status`;
  postJson(url, param, then, error);
};
// 体系内审，提交审核方案
export const submit_audit_plan = (param, then, error) => {
  const url = `/api/system_audit_router/submit_audit_plan`;
  postJson(url, param, then, error);
};
// 体系内审，提交实施计划
export const submit_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/submit_review_plan`;
  postJson(url, param, then, error);
};
// 体系内审，获取操作记录
export const task_records = (param, then, error) => {
  const url = `/api/system_audit_router/task_records`;
  postJson(url, param, then, error);
};
// 体系内审，管理者审核
export const manager_review = (param, then, error) => {
  const url = `/api/system_audit_router/manager_review`;
  postJson(url, param, then, error);
};
// 体系内审，总经理审核
export const gen_manager_review = (param, then, error) => {
  const url = `/api/system_audit_router/gen_manager_review`;
  postJson(url, param, then, error);
};
// 体系内审，首次会议签到表上传
export const uploadFirstMeeting = (param, formData, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/system_audit_router/first_meeting?` + params;
  postFormData(url, formData, then, error);
};
export const uploadLastMeeting = (param, formData, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/system_audit_router/last_meeting?` + params;
  postFormData(url, formData, then, error);
};
// 体系内审，获取内审检查表
export const read_audit_checklist = (param, then, error) => {
  const url = `/api/system_audit_router/get_audit_checklist`;
  postJson(url, param, then, error);
};
// 体系内审，新增内审检查表
export const create_audit_checklist = (param, then, error) => {
  const url = `/api/system_audit_router/audit_checklist`;
  postJson(url, param, then, error);
};
// 体系内审，修改内审检查表
export const update_audit_checklist = (param, then, error) => {
  const url = `/api/system_audit_router/update_audit_checklist`;
  postJson(url, param, then, error);
};
// 体系内审，删除内审检查表
export const delete_audit_checklist = (param, then, error) => {
  const url = `/api/system_audit_router/del_audit_checklist`;
  postJson(url, param, then, error);
};
// 体系内审，新增检查表项
export const create_audit_checklist_item = (param, then, error) => {
  const url = `/api/system_audit_router/add_audit_checklist_item`;
  postJson(url, param, then, error);
};
// 体系内审，编辑检查表项
export const update_audit_checklist_item = (param, then, error) => {
  const url = `/api/system_audit_router/update_audit_checklist_item`;
  postJson(url, param, then, error);
};
// 体系内审，删除检查表项
export const delete_audit_checklist_item = (param, then, error) => {
  const url = `/api/system_audit_router/del_audit_checklist_item`;
  postJson(url, param, then, error);
};
// 体系内审，确认检查表
export const confirm_internal_checklist = (param, then, error) => {
  const url = `/api/system_audit_router/checklist_confirm`;
  postJson(url, param, then, error);
};
// 体系内审，确认检查表
export const read_meeting_sheets = (param, then, error) => {
  const url = `/api/system_audit_router/meeting_sheets`;
  postJson(url, param, then, error);
};
// 体系内审，新增不符合项
export const create_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/add_non_conformance`;
  postJson(url, param, then, error);
};
// 体系内审，更新不符合项
export const update_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/update_non_conformance`;
  postJson(url, param, then, error);
};
// 体系内审，更新不符合项
export const read_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/read_non_conformance`;
  postJson(url, param, then, error);
};
// 体系内审，删除不符合项
export const delete_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/del_non_conformance`;
  postJson(url, param, then, error);
};
// 体系内审，确认不符合项
export const confirm_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/confirm_non_conformance`;
  postJson(url, param, then, error);
};
// 体系内审，获取内部审核报告
export const read_internal_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/read_internal_audit_report`;
  postJson(url, param, then, error);
};
// 体系内审，提交内部审核报告
export const update_internal_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/update_internal_audit_report`;
  postJson(url, param, then, error);
};
// 体系内审，上传整改证据文件
export const uploadEvidenceFile = (param, formData, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/system_audit_router/conformance_file?` + params;
  postFormData(url, formData, then, error);
};
// 体系内审，审批内部审核报告
export const approval_internal_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/approval`;
  postJson(url, param, then, error);
};
// 体系内审，获取不符合项分布表
export const read_non_conformance_distribution = (param, then, error) => {
  const url = `/api/system_audit_router/non_conformance_distribution`;
  postJson(url, param, then, error);
};
// 体系内审，结案
export const close_case = (param, then, error) => {
  const url = `/api/system_audit_router/close_case`;
  postJson(url, param, then, error);
};
// 检测设备，设备申领查询
export const getDeviceApply = (param, then, error) => {
  const url = `/api/measuring_tools/get_device_apply`;
  postJson(url, param, then, error);
};
// 检测设备，设备申领新建
export const addDeviceApply = (param, then, error) => {
  const url = `/api/measuring_tools/device_apply`;
  postJson(url, param, then, error);
};
// 检测设备，设备申领修改
export const updateDeviceApply = (param, then, error) => {
  const url = `/api/measuring_tools/device_apply`;
  putRequest(url, param, then, error);
};
// 检测设备，设备申领删除
export const deleteDeviceApply = (param, then, error) => {
  const url = `/api/measuring_tools/device_apply`;
  deleteRequest(url, param, then, error);
};
// 检测设备，设备申领审批
export const deviceApplyApprove = (param, then, error) => {
  const url = `/api/measuring_tools/device_approve`;
  postJson(url, param, then, error);
};
// 检测设备，设备申领发放
export const deviceApplyDistribution = (param, then, error) => {
  const url = `/api/measuring_tools/device_distribution`;
  postJson(url, param, then, error);
};
// 检测设备，增加年度MSA计划
export const createMSAYearPlan = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan`;
  postJson(url, param, then, error);
};
// 检测设备，查询年度MSA计划
export const readMSAYearPlan = (param, then, error) => {
  const url = `/api/measuring_tools/get_MSA_year_plan`;
  postJson(url, param, then, error);
};
// 检测设备，修改年度MSA计划
export const updateMSAYearPlan = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan`;
  putRequest(url, param, then, error);
};
// 检测设备，删除年度MSA计划
export const deleteMSAYearPlan = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan`;
  deleteRequest(url, param, then, error);
};
// 检测设备，增加年度MSA计划内容
export const createMSAYearPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan_content`;
  postJson(url, param, then, error);
};
// 检测设备，查询年度MSA计划内容
export const readMSAYearPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/get_MSA_year_plan_content`;
  postJson(url, param, then, error);
};
// 检测设备，修改年度MSA计划内容
export const updateMSAYearPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan_content`;
  putRequest(url, param, then, error);
};
// 检测设备，删除年度MSA计划内容
export const deleteMSAYearPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_year_plan_content`;
  deleteRequest(url, param, then, error);
};
// 检测设备，增加MSA计划内容
export const createMSAPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_plan_content`;
  postJson(url, param, then, error);
};
// 检测设备，查询MSA计划内容
export const readMSAPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/get_MSA_plan_content`;
  postJson(url, param, then, error);
};
// 检测设备，修改MSA计划内容
export const updateMSAPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_plan_content`;
  putRequest(url, param, then, error);
};
// 检测设备，删除MSA计划内容
export const deleteMSAPlanContent = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_plan_content`;
  deleteRequest(url, param, then, error);
};
// 检测设备，查询MSA计划报告
export const readMSAPlanReport = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_plan_report`;
  postJson(url, param, then, error);
};
// 检测设备，修改MSA计划报告
export const updateMSAPlanReport = (param, then, error) => {
  const url = `/api/measuring_tools/MSA_plan_report`;
  putRequest(url, param, then, error);
};
// 分层审核，获取固定项目信息
export const fixed_info = (param, then, error) => {
  const url = `/api/layered_audit/fixed_info`;
  getParams(url, param, then, error);
};
// 分层审核，获取人员信息
export const nick_name = (param, then, error) => {
  const url = `/api/layered_audit/nick_name`;
  postJson(url, param, then, error);
};
// 分层审核，获取审核人员信息
export const examine_nick_name = (param, then, error) => {
  const url = `/api/layered_audit/examine_nick_name`;
  getParams(url, param, then, error);
};
// 分层审核，在线浏览
export const online_review = (param, then, error) => {
  const url = `/api/layered_audit/online_review`;
  getParams(url, param, then, error);
};
// 分层审核，在线浏览下载
export const download_online_review_qms = (param, then, error) => {
  const url = `/api/layered_audit/download_online_review`;
  getParams(url, param, then, error);
};
// 成品检验，
export const finished_product_inspection = (param, then, error) => {
  const url = `/api/inspection_router/finished_product_inspection`;
  postJson(url, param, then, error);
};
// 成品检验，数据导出
export const finished_product_inspection_export = (param, then, error) => {
  const url = `/api/inspection_router/finished_product_inspection_export`;
  postJson(url, param, then, error);
};
// 过程检验选项
export const process_inspection_options = (param, then, error) => {
  const url = `/api/inspection_router/process_inspection_options`;
  getParams(url, param, then, error);
};
// 过程检验
export const process_inspection = (param, then, error) => {
  const url = `/api/inspection_router/process_inspection`;
  postJson(url, param, then, error);
};
// 过程检验，数据导出
export const process_inspection_export = (param, then, error) => {
  const url = `/api/inspection_router/process_inspection_export`;
  postJson(url, param, then, error);
};
// 过程检验，整改选项
export const rectify_opntions = (param, then, error) => {
  const url = `/api/inspection_router/rectify_opntions`;
  getParams(url, param, then, error);
};
// 过程检验，整改
export const process_inspection_rectify = (param, then, error) => {
  const url = `/api/inspection_router/process_inspection_rectify`;
  postJson(url, param, then, error);
};
// 项目质量管理 项目新增
export const create_project_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_project`;
  postJson(url, param, then, error);
};
// 项目质量管理 项目查询
export const read_project_quality = (param, then, error) => {
  const url = `/api/project_quality/get_quality_project`;
  postJson(url, param, then, error);
};
// 项目质量管理 项目修改
export const update_project_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_project`;
  putRequest(url, param, then, error);
};
// 项目质量管理 项目删除
export const delete_project_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_project`;
  deleteRequest(url, param, then, error);
};
// 项目质量管理 阶段新增
export const create_stage_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_stage`;
  postJson(url, param, then, error);
};
// 项目质量管理 阶段查询
export const read_stage_quality = (param, then, error) => {
  const url = `/api/project_quality/get_quality_stage`;
  postJson(url, param, then, error);
};
// 项目质量管理 阶段修改
export const update_stage_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_stage`;
  putRequest(url, param, then, error);
};
// 项目质量管理 阶段删除
export const delete_stage_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_stage`;
  deleteRequest(url, param, then, error);
};
// 项目质量管理 事项新增
export const create_matter_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_matter`;
  postFormData(url, param, then, error);
};
// 项目质量管理 事项查询
export const read_matter_quality = (param, then, error) => {
  const url = `/api/project_quality/get_quality_matter`;
  postJson(url, param, then, error);
};
// 项目质量管理 事项修改
export const update_matter_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_matter`;
  postFormData(url, param, then, error, "put");
};
// 项目质量管理 事项删除
export const delete_matter_quality = (param, then, error) => {
  const url = `/api/project_quality/quality_matter`;
  deleteRequest(url, param, then, error);
};
export const download_matter_file = (param, then, error) => {
  const url = `/api/project_quality/download_file`;
  return getParams(url, param, then, error);
};
// 质量成本-获取数据
export const read_quality_cost = (param, then, error) => {
  const url = `/api/quality_cost_router/read_quality_cost`;
  postJson(url, param, then, error);
};
// 质量成本-新增成本数据
export const create_quality_cost = (param, then, error) => {
  const url = `/api/quality_cost_router/create_quality_cost`;
  postJson(url, param, then, error);
};
// 质量成本-更新成本数据
export const update_quality_cost = (param, then, error) => {
  const url = `/api/quality_cost_router/update_quality_cost`;
  postJson(url, param, then, error);
};
// 质量成本-获取委外检数据
export const read_outsourced_inspection = (param, then, error) => {
  const url = `/api/quality_cost_router/read_outsourced_inspection`;
  postJson(url, param, then, error);
};
// 质量成本-新增委外检数据
export const create_outsourced_inspection = (param, then, error) => {
  const url = `/api/quality_cost_router/create_outsourced_inspection`;
  postJson(url, param, then, error);
};
// 质量成本-更新委外检数据
export const update_outsourced_inspection = (param, then, error) => {
  const url = `/api/quality_cost_router/update_outsourced_inspection`;
  postJson(url, param, then, error);
};
// 质量成本-委外检选项
export const outsourced_inspection_option = (param, then, error) => {
  const url = `/api/quality_cost_router/outsourced_inspection_option`;
  getParams(url, param, then, error);
};
//分层审核-删除
export const layered_audit_plan_fencile_delete = (param, then, error) => {
  const url = `/api/layered_audit/layered_audit_plan`;
  deleteRequest(url, param, then, error);
};
// 分层审核实时展示
export const real_review = (param, then, error) => {
  const url = `/api/layered_audit/real_review`;
  postFormData(url, param, then, error);
};
// 数据看板-面板接口
export const get_real_time_panel = (param, then, error) => {
  const url = `/api/quality_dashboard/get_real_time_panel`;
  getParams(url, param, then, error);
};
// 数据看板-明细接口
export const get_inspection_DetailsTable = (param, then, error) => {
  const url = `/api/quality_dashboard/get_inspection_DetailsTable`;
  getParams(url, param, then, error);
};
// 数据看板-柏拉图接口
export const get_error_pareto = (param, then, error) => {
  const url = `/api/quality_dashboard/get_error_pareto`;
  postJson(url, param, then, error);
};
// 数据看板-时间周期接口
export const get_qualified_chart = (param, then, error) => {
  const url = `/api/quality_dashboard/get_qualified_chart`;
  postJson(url, param, then, error);
};
// SPC派工-获取工艺任务
export const get_craft_task = (param, then, error) => {
  const url = `/api/spc_alarm_router/get_craft_task`;
  getParams(url, param, then, error);
};
// SPC派工-我的任务
export const my_craft_task = (param, then, error) => {
  const url = `/api/spc_alarm_router/my_craft_task`;
  getParams(url, param, then, error);
};
//SPC派工-接取工艺任务
export const take_mission = (param, then, error) => {
  const url = `/api/spc_alarm_router/take_mission`;
  postJson(url, param, then, error);
};
//SPC派工-提交工艺任务
export const submit_craft_task = (param, then, error) => {
  const url = `/api/spc_alarm_router/submit_craft_task`;
  postJson(url, param, then, error);
};
// 质量预警-增加质量
export const quality_warning = (param, then, error) => {
  const url = `/api/quality_warning/quality_warning`;
  postFormData(url, param, then, error);
};
// 质量预警-修改质量
export const quality_warning_put = (param, then, error) => {
  const url = `/api/quality_warning/quality_warning`;
  putFormData(url, param, then, error);
};
// 质量预警-删除质量
export const quality_warning_delete = (param, then, error) => {
  const url = `/api/quality_warning/quality_warning`;
  deleteRequest(url, param, then, error);
};
// 质量预警-查询质量
export const get_quality_warning = (param, then, error) => {
  const url = `/api/quality_warning/get_quality_warning`;
  postJson(url, param, then, error);
};
// 质量预警-下载质量
export const download_file_zhiliang = (param, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/quality_warning/download_file?` + params;
  downloadFile(url, undefined, then, error);
};
// 统计分析
export const statistical_analysis = (param, then, error) => {
  const url = `/api/layered_audit/statistical_analysis`;
  postJson(url, param, then, error);
};
// 评审管理-增加评审管理
export const review_plan = (param, then, error) => {
  const url = `/api/review_management/review_plan`;
  postJson(url, param, then, error);
};
// 评审管理-修改评审管理
export const review_plan_put = (param, then, error) => {
  const url = `/api/review_management/review_plan`;
  putRequest(url, param, then, error);
};
// 评审管理-删除评审管理
export const review_plan_delete = (param, then, error) => {
  const url = `/api/review_management/review_plan`;
  deleteRequest(url, param, then, error);
};
// 评审管理- 查询评审计划
export const get_review_plan = (param, then, error) => {
  const url = `/api/review_management/get_review_plan`;
  postJson(url, param, then, error);
};
// 评审管理-获取文件详情
export const file_management = (param, then, error) => {
  const url = `/api/review_management/file_management`;
  getParams(url, param, then, error);
};
// 评审管理- 上传文件信息
export const upload_file = (param, fromData, then, error) => {
  const params = new URLSearchParams(param).toString();
  const url = `/api/review_management/upload_file?` + params;
  postFormData(url, fromData, then, error);
};
// 评审管理- 下载文件信息
export const download_file = (param, then, error) => {
  const url = `/api/review_management/download_file`;
  getParams(url, param, then, error);
};
// 评审管理- 下载文件信息
export const delete_file = (param, then, error) => {
  const url = `/api/review_management/delete_file`;
  deleteRequest(url, param, then, error);
};
// 评审管理- 增加报告
export const review_report = (param, then, error) => {
  const url = `/api/review_management/review_report`;
  postJson(url, param, then, error);
};
// 评审管理- 修改报告
export const review_report_put = (param, then, error) => {
  const url = `/api/review_management/review_report`;
  putRequest(url, param, then, error);
};
// 评审管理-删除报告
export const review_report_delete = (param, then, error) => {
  const url = `/api/review_management/review_report`;
  deleteRequest(url, param, then, error);
};
// 评审管理- 查询报告
export const get_review_report = (param, then, error) => {
  const url = `/api/review_management/get_review_report`;
  postJson(url, param, then, error);
};
// 评审管理- 增加改进跟踪
export const item_tracking = (param, then, error) => {
  const url = `/api/review_management/item_tracking`;
  postJson(url, param, then, error);
};
// 评审管理- 查询改进跟踪
export const get_item_tracking = (param, then, error) => {
  const url = `/api/review_management/get_item_tracking`;
  postJson(url, param, then, error);
};
// 评审管理- 修改改进跟踪
export const item_tracking_put = (param, then, error) => {
  const url = `/api/review_management/item_tracking`;
  putRequest(url, param, then, error);
};
// 评审管理- 删除改进跟踪
export const item_tracking_delete = (param, then, error) => {
  const url = `/api/review_management/item_tracking`;
  deleteRequest(url, param, then, error);
};
// 过程审核- 删除过程审核计划
export const audit_plan_delete = (param, then, error) => {
  const url = `/api/process_audit/audit_plan`;
  deleteRequest(url, param, then, error);
};
// 过程审核- 增加过程审核计划
export const audit_plan_add = (param, then, error) => {
  const url = `/api/process_audit/audit_plan`;
  postJson(url, param, then, error);
};
// 过程审核- 修改过程审核计划
export const audit_plan_put = (param, then, error) => {
  const url = `/api/process_audit/audit_plan`;
  putRequest(url, param, then, error);
};
// 过程审核- 查询过程审核计划
export const get_audit_plan_process_audit = (param, then, error) => {
  const url = `/api/process_audit/get_audit_plan`;
  postJson(url, param, then, error);
};
// 过程审核-获取文件详情
export const file_management_process_audit = (param, then, error) => {
  const url = `/api/process_audit/file_management`;
  getParams(url, param, then, error);
};
// 过程审核- 上传文件信息
export const upload_file_process_audit = (param, fromData, then, error) => {
  const url = `/api/process_audit/upload_file?` + new URLSearchParams(param).toString();
  postFormData(url, fromData, then, error);
};
// 过程审核- 下载文件信息
export const download_file_download_file = (param, then, error) => {
  const url = `/api/process_audit/download_file`;
  getParams(url, param, then, error);
};
// 过程审核-删除文件信息
export const download_file_download_file_delete = (param, then, error) => {
  const url = `/api/process_audit/delete_file`;
  deleteRequest(url, param, then, error);
};
// 过程审核- 增加改进事项跟踪
export const item_tracking_post = (param, then, error) => {
  const url = `/api/process_audit/item_tracking`;
  postJson(url, param, then, error);
};
// 过程审核- 查询改进事项跟踪
export const item_tracking_get = (param, then, error) => {
  const url = `/api/process_audit/get_item_tracking`;
  postJson(url, param, then, error);
};
// 过程审核- 修改改进事项跟踪
export const item_tracking_put_process_audit = (param, then, error) => {
  const url = `/api/process_audit/item_tracking`;
  putRequest(url, param, then, error);
};
// 过程审核- 删除改进事项跟踪
export const item_tracking_delete_process_audit = (param, then, error) => {
  const url = `/api/process_audit/item_tracking`;
  deleteRequest(url, param, then, error);
};
// 产品审核- 新建计划
export const create_product_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/create_product_review_plan`;
  postJson(url, param, then, error);
};
// 产品审核- 修改计划
export const update_product_review_plan = (param, then, error) => {
  const url = `/api/system_audit_router/update_product_review_plan`;
  postJson(url, param, then, error);
};
// 产品审核- 新增检验标准
export const create_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/create_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 查询检验标准
export const read_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/read_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 修改检验标准
export const update_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/update_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 删除检验标准
export const del_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/del_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 新增检验记录
export const create_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/create_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 查询检验记录
export const read_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/read_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 修改检验记录
export const update_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/update_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 删除检验记录
export const del_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/del_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 新增产品审核报告
export const create_product_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/create_product_audit_report`;
  postJson(url, param, then, error);
};
// 产品审核- 查询产品审核报告
export const read_product_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/read_product_audit_report`;
  postJson(url, param, then, error);
};
// 产品审核- 修改产品审核报告
export const update_product_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/update_product_audit_report`;
  postJson(url, param, then, error);
};
// 产品审核- 删除产品审核报告
export const del_product_audit_report = (param, then, error) => {
  const url = `/api/system_audit_router/del_product_audit_report`;
  postJson(url, param, then, error);
};
// 产品审核- 新增不符合项
export const create_product_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/create_product_non_conformance`;
  postJson(url, param, then, error);
};
// 产品审核- 查询不符合项
export const read_product_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/read_product_non_conformance`;
  postJson(url, param, then, error);
};
// 产品审核- 修改不符合项
export const update_product_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/update_product_non_conformance`;
  postJson(url, param, then, error);
};
// 产品审核- 删除不符合项
export const del_product_non_conformance = (param, then, error) => {
  const url = `/api/system_audit_router/del_product_non_conformance`;
  postJson(url, param, then, error);
};
