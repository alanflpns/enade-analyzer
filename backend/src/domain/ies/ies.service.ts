import IIesRepository from "./interfaces/ies.repository.interface";

export class IesService {
  repository: IIesRepository;

  constructor(iesRepository: IIesRepository) {
    this.repository = iesRepository;
  }

  async getIes({ uf, cod_ies }: { uf: string; cod_ies: number }) {
    const query: any = {};
    if (uf) query.uf = uf;
    if (cod_ies) query.cod_ies = cod_ies;
    const ies = await this.repository.getIes(query);
    return ies;
  }
  async getQuestionsTheme(ano: number) {
    const ies = await this.repository.getQuestionsTheme(ano);
    return ies;
  }
}
