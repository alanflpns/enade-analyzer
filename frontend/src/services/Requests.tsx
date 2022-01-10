import AxiosApi from "./AxiosApi";

const Requests = {
  getData: (year: string, ies: number) => {
    const request = AxiosApi.get(
      `/result-enade-general?ano=${year}&cod_ies=${ies}`
    );
    return request;
  },
  getIes: () => {
    const request = AxiosApi.get(`/ies`);
    return request;
  },
};

export default Requests;
