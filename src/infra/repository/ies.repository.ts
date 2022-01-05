import { Collection, Document, Model } from "mongoose";
import { IIes } from "../../domain/ies/interfaces/ies.interface";
import IIesRepository from "../../domain/ies/interfaces/ies.repository.interface";

export class IesRepository implements IIesRepository {
  private readonly collection: Collection;
  constructor(model: Model<Document<IIes>>) {
    this.collection = model.collection;
  }
  async getIes() {
    const ies: IIes[] = (await this.collection
      .find(
        {},
        {
          projection: {
            cod_ies: 1,
            sigla: 1,
            municipio: 1,
            uf: 1,
          },
        }
      )
      .toArray()) as unknown as IIes[];

    return ies;
  }
}
