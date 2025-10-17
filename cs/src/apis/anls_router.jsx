import { getParams, postJson, get, postFormData } from "./instance";

export const getSpcAnalysis = (param, then, error) => {
  const url = `/api/anls_router/get_spc_analysis`;
  postJson(url, param, then, error);
};
export const detailedFurnaceInfo = (param, then, error = () => {}) => {
  const url = `/api/anls_router/detailed_furnace_info`;
  postJson(url, param, then, error);
};
export const reSpcaAnalysis = (param, then, error) => {
  const url = `/api/anls_router/re_spc`;
  postJson(url, param, then, error);
};
export const rprocessSpcAnalysis = (param, then, error) => {
  const url = `/api/anls_router/process_spc`;
  postJson(url, param, then, error);
};
export const qualityDataStorage = (formData, then, error) => {
  const url = `/api/anls_router/quality_data_storage`;
  postFormData(url, formData, then, error);
};
export const updateQualityData = (param, then, error) => {
  const url = `/api/anls_router/update_quality_data`;
  postJson(url, param, then, error);
};
export const delQualityData = (param, then, error) => {
  const url = `/api/anls_router/del_quality_data`;
  postJson(url, param, then, error);
};
export const readQualityData = (param, then, error) => {
  const url = `/api/anls_router/read_quality_data`;
  postJson(url, param, then, error);
};
export const getSpcOptions = (then, error) => {
  const url = `/api/anls_router/spc_options`;
  get(url, then, error);
};
export const getSpecOptions = (then, error) => {
  const url = `/api/spec_router/spec_options`;
  get(url, then, error);
};
export const createSpec = (param, then, error) => {
  const url = `/api/spec_router/create_spec`;
  postJson(url, param, then, error);
};
export const deleteSpec = (param, then, error) => {
  const url = `/api/spec_router/delete_spec`;
  postJson(url, param, then, error);
};
export const updateSpec = (param, then, error) => {
  const url = `/api/spec_router/update_spec`;
  postJson(url, param, then, error);
};
export const readSpec = (param, then, error) => {
  const url = `/api/spec_router/read_spec`;
  postJson(url, param, then, error);
};
export const specDispatchOptions = (then, error = () => {}) => {
  const url = `/api/spec_router/dispatch_options`;
  postJson(url, {}, then, error);
};
export const createSpecDispatchConfiguration = (
  param,
  then,
  error = () => {}
) => {
  const url = `/api/spec_router/create_dispatch_configuration`;
  postJson(url, param, then, error);
};
export const delSpecDispatchConfiguration = (param, then, error = () => {}) => {
  const url = `/api/spec_router/delete_dispatch_configuration`;
  postJson(url, param, then, error);
};
export const upSpecDispatchConfiguration = (param, then, error = () => {}) => {
  const url = `/api/spec_router/update_dispatch_configuration`;
  postJson(url, param, then, error);
};
export const readSpecDispatchConfiguration = (
  param,
  then,
  error = () => {}
) => {
  const url = `/api/spec_router/read_dispatch_configuration`;
  postJson(url, param, then, error);
};
