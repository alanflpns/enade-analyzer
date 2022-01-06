import { IesService } from "../ies/ies.service";
import IMicrodataRepository from "./interfaces/microdata.repository.interface";

export class MicrodataService {
  repository: IMicrodataRepository;
  iesService: IesService;

  constructor(repository: IMicrodataRepository, iesService: IesService) {
    this.repository = repository;
    this.iesService = iesService;
  }

  async getMicrodataResume({
    uf,
    cod_ies,
    ano,
  }: {
    uf: string;
    cod_ies: number;
    ano: number;
  }) {
    const queryIes: any = {};
    if (uf) queryIes.uf = uf;
    if (cod_ies) queryIes.cod_ies = cod_ies;
    const ies = await this.iesService.getIes(queryIes);
    const cod_ies_arr = ies.map((i) => i.cod_ies);

    const query = {
      CO_IES: { $in: cod_ies_arr },
      NU_ANO: ano,
      //CO_GRUPO é o curso de sistemas de informação
      CO_GRUPO: 4006,
    };
    const result = await this.repository.getMicrodataResume(query, ano);

    const objresult = result.map((item) => {
      //@ts-ignore
      item.result = item.result.map((result) => {
        //@ts-ignore
        result.percent = Number(result.count / item.total).toFixed(3);
        return result;
      });
      //@ts-ignore
      item.tema = item._id;
      //@ts-ignore
      delete item._id;
      return item;
    });
    return objresult;
  }
}
