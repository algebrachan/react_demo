import { base_url, getParams, postJson, get } from "./instance";

export const getDevicesInfo = (then, error) => {
  const url = base_url + `/api/mform_router/get_devices_info`;
  get(url, then, error);
};
// device
export const getDeviceDetails = (param, then, error) => {
  const url = base_url + `/api/mform_router/get_device_details`;
  getParams(url, param, then, error);
};
