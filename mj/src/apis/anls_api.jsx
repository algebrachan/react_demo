import { base_url, downloadFile, get, getParams, postJson } from "./instance";

const API_PREFIX = `${base_url}/api/anls_router`;

// 默认错误处理
const defaultError = (error) => console.error("API Error:", error);

// 获取数据列表相关API
export const getSearchList = (then, error = defaultError) =>
  get(`${API_PREFIX}/get_search_list`, then, error);

export const getFeatureList = (then, error = defaultError) =>
  get(`${API_PREFIX}/get_feature_list`, then, error);

export const getQualityParamList = (then, error = defaultError) =>
  get(`${API_PREFIX}/get_quality_param_list`, then, error);

// 带参数的POST请求API
export const getLotId = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_crucible_id`, param, then, error);

export const getPprId = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_ppr_id`, param, then, error);

export const getAnlsLine = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_anls_line`, param, then, error);

export const getFeatureStatLine = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_feature_stat_line`, param, then, error);

export const getCrInspectionForm = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_cr_inspection_form`, param, then, error);

export const getChannelCotrolLine = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_channel_cotrol_line`, param, then, error);

export const getCorrelationAnlsLine = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_correlation_anls_line`, param, then, error);

export const getCategoryAnlsLine = (param, then, error = defaultError) =>
  postJson(`${API_PREFIX}/get_category_anls_line`, param, then, error);
export const getFeatureStatLineMultipart = (
  param,
  then,
  error = defaultError
) =>
  postJson(`${API_PREFIX}/get_feature_stat_line_multipart`, param, then, error);

// device_id
export const getEvalution = (param, then, error) => {
  const url = base_url + `/api/de_router/get_evalution`;
  getParams(url, param, then, error);
};

export const rmsGetModelOptional = (then, error) => {
  const url = base_url + `/api/rms_router/get_model_optional`;
  getParams(url, {}, then, error);
};
export const rmsFilterModelData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/filter_model_data`;
  postJson(url, param, then, error);
};
const url = base_url + `/api/rms_router/add_model_data`;
export const rmsAddModelData = (param, then, error = defaultError) => {
  postJson(url, param, then, error);
};
export const rmsDeleteModelData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/delete_model_data`;
  postJson(url, param, then, error);
};
export const rmsUpdateModelData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/update_model_data`;
  postJson(url, param, then, error);
};
export const rmsGetMoldOptional = (then, error) => {
  const url = base_url + `/api/rms_router/get_mold_optional`;
  getParams(url, {}, then, error);
};
export const rmsFilterMoldData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/filter_mold_data`;
  postJson(url, param, then, error);
};
export const rmsAddMoldData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/add_mold_data`;
  postJson(url, param, then, error);
};
export const rmsDeleteMoldData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/delete_mold_data`;
  postJson(url, param, then, error);
};
export const rmsUpdateMoldData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/update_mold_data`;
  postJson(url, param, then, error);
};

export const rmsGetFigureOptional = (then, error) => {
  const url = base_url + `/api/rms_router/get_figure_optional`;
  getParams(url, {}, then, error);
};
export const rmsFilterFigureData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/filter_figure_data`;
  postJson(url, param, then, error);
};
export const rmsAddFigureData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/add_figure_data`;
  postJson(url, param, then, error);
};
export const rmsDeleteFigureData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/delete_figure_data`;
  postJson(url, param, then, error);
};
export const rmsUpdateFigureData = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/update_figure_data`;
  postJson(url, param, then, error);
};
export const rmsExportModelCsv = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/export_model_csv`;
  downloadFile(url, param, then, error);
};
export const rmsExportMoldCsv = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/export_mold_csv`;
  downloadFile(url, param, then, error);
};
export const rmsExportFigureCsv = (param, then, error = defaultError) => {
  const url = base_url + `/api/rms_router/export_figure_csv`;
  downloadFile(url, param, then, error);
};
