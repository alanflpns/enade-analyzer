import AxiosApi from "./AxiosApi";

const Requests = {
  getData: () => {
    const request = AxiosApi.get("/result-enade-general?ano=2017&cod_ies=3183");
    return request;
  },
};

export default Requests;
