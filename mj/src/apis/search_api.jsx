import { base_url, get, postFormData, postJson } from "./instance";

export const getProductionSchedule = (param, then, error = () => {}) => {
  const url = base_url + `/api/search_router/get_production_schedule`;
  postJson(url, param, then, error);
};
export const exportProductionSchedule = (param, then, error = () => {}) => {
  const url = base_url + `/api/search_router/export_production_schedule`;
  postJson(url, param, then, error);
};
export const spotUserLotList = (param, then, error = () => {}) => {
  const url = base_url + `/api/spot/get_user_lot_list`;
  postJson(url, param, then, error);
};
export const spotCheckDatas = (param, then, error = () => {}) => {
  const url = base_url + `/api/spot/get_spot_check_datas`;
  postJson(url, param, then, error);
};
export const getBatchTable = (param, then, error) => {
  const url = base_url + `/api/batch/batch_table`;
  postJson(url, param, then, error);
};
export const getRongrongLotnumbers = (param, then, error) => {
  const url = base_url + `/api/db_router/get_rongrong_lotnumbers`;
  postJson(url, param, then, error);
};
export const searchRongrongData = (param, then, error) => {
  const url = base_url + `/api/db_router/search_rongrong_data`;
  postJson(url, param, then, error);
};
export const exportRongrongData = (param, then, error) => {
  const url = base_url + `/api/db_router/export_rongrong_data`;
  postJson(url, param, then, error);
};
export const getProductionConditionComparison = (param, then, error) => {
  const url = base_url + `/api/monitor_router/get_production_condition_comparison`;
  postJson(url, param, then, error);
};
