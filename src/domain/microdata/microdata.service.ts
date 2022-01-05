import IMicrodataRepository from "./interfaces/microdata.repository.interface";

export class MicrodataService {
  repository: IMicrodataRepository;

  constructor(iesRepository: IMicrodataRepository) {
    this.repository = iesRepository;
  }

  async getMicrodataResume() {
    const ies = await this.repository.getMicrodataResume();
    return ies;
  }
}
