import { stringifyQueryString } from "../helpers/FnUtils";
import AxiosApi from "./AxiosApi";

const Requests = {
  getData: (ano: string, cod_ies?: number, uf?: string) => {
    const request = AxiosApi.get(
      `/result-enade-general?${stringifyQueryString({ ano, cod_ies, uf })}`
    );
    return request;
  },
  getIes: () => {
    const request = AxiosApi.get(`/ies`);
    return request;
  },
};

export default Requests;
