import IIesRepository from "./interfaces/ies.repository.interface";

export class IesService {
  repository: IIesRepository;

  constructor(iesRepository: IIesRepository) {
    this.repository = iesRepository;
  }

  async getIes() {
    const ies = await this.repository.getIes();
    return ies;
  }
}
