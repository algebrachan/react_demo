import { base_url, get, postFormData, postJson } from "./instance";

export const getTpmOptitons = (then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/get_optitons`;
    get(url, then, error);
};
export const getTpmDetailsOptitons = (then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/get_tpm_details_options`;
    get(url, then, error);
};
export const getTpmInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/get_tpm_infomations`;
    postJson(url, param, then, error);
};
export const getShutdownInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/get_shutdown_infomations`;
    postJson(url, param, then, error);
};
export const insertTpmInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/operate_tpm_infomations`;
    postJson(url, param, then, error);
};
export const insertShutdownInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/operate_shutdown_infomations`;
    postJson(url, param, then, error);
};
export const statisticsTpmInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/statistics_tpm_infomations`;
    postJson(url, param, then, error);
};
export const statisticsShutdownInfomations = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/statistics_shutdown_infomations`;
    postJson(url, param, then, error);
};
export const addTpmOptions = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/add_tpm_options`;
    postJson(url, param, then, error);
};
export const addTpmDetailsOptions = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/add_tpm_details_options`;
    postJson(url, param, then, error);
};
export const getTpmDetails = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/get_tpm_details`;
    postJson(url, param, then, error);
};
export const deleteTpmDetails = (param, then, error = () => { }) => {
    const url = base_url + `/api/tpm_router/delete_tpm_details`;
    postJson(url, param, then, error);
};
export const addTpmDetails = (formData, then, error) => {
    let url = base_url + `/api/tpm_router/add_tpm_details`;
    postFormData(url, formData, then, error);
};
export const updateTpmDetails = (formData, then, error) => {
    let url = base_url + `/api/tpm_router/update_tpm_details`;
    postFormData(url, formData, then, error);
};
export const downloadTables = (param, then, error) => {
    let url = base_url + `/api/tpm_router/download_tables`;
    postJson(url, param, then, error);
};
export const downloadTpmDetails = (param, then, error) => {
    let url = base_url + `/api/tpm_router/download_tpm_details`;
    postJson(url, param, then, error);
};

export const addIqcData = (param, then, error) => {
    let url = base_url + `/api/iqc_router/add_iqc_data`;
    postJson(url, param, then, error);
};
export const searchIqcData = (param, then, error) => {
    let url = base_url + `/api/iqc_router/search_iqc_data`;
    postJson(url, param, then, error);
};
export const updateIqcData = (param, then, error) => {
    let url = base_url + `/api/iqc_router/update_iqc_data`;
    postJson(url, param, then, error);
};
export const deleteIqcData = (param, then, error) => {
    let url = base_url + `/api/iqc_router/delete_iqc_data`;
    postJson(url, param, then, error);
};