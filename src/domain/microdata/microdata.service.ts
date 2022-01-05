import { IesService } from "../ies/ies.service";
import IMicrodataRepository from "./interfaces/microdata.repository.interface";

export class MicrodataService {
  repository: IMicrodataRepository;
  iesService: IesService;

  constructor(repository: IMicrodataRepository, iesService: IesService) {
    this.repository = repository;
    this.iesService = iesService;
  }

  async getMicrodataResume({ uf, cod_ies }: { uf: string; cod_ies: number }) {
    const queryIes: any = {};
    if (uf) queryIes.uf = uf;
    if (cod_ies) queryIes.cod_ies = cod_ies;
    const ies = await this.iesService.getIes(queryIes);
    const cod_ies_arr = ies.map((i) => i.cod_ies);
    const query = {
      CO_IES: { $in: cod_ies_arr },
    };
    const result = await this.repository.getMicrodataResume(query);

    const objresult = result.map((item) => {
      //@ts-ignore
      item.result.map((result) => {
        if (result.resposta === undefined) {
          //@ts-ignore
          item.total = item.total - result.count;
        }
      });
      //@ts-ignore
      item.result = item.result.map((result) => {
        if (result.resposta !== undefined) {
          //@ts-ignore
          result.percent = Number(result.count / item.total).toFixed(3);
        }
        return result;
      });
      return item;
    });
    return objresult;
  }
}
