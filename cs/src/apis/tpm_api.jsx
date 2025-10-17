import {getParams} from "./instance.jsx";
import {createBaseRequest} from '@/apis/base.js'

const base_url = import.meta.env.VITE_TPM_API;
const base_req = createBaseRequest(base_url);
// partitionId
export const getTpmPresentData = (param, then, error) => {
  const url = `/api/report/presentData`;
  getParams(url, param, then, error, base_req);
};
