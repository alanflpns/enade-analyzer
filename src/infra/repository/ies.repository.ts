import { Collection, Connection, Document, Model } from "mongoose";
import { IIes } from "../../domain/ies/interfaces/ies.interface";
import IIesRepository from "../../domain/ies/interfaces/ies.repository.interface";

export class IesRepository implements IIesRepository {
  private readonly collection: Collection;
  private readonly db: Connection;
  constructor(model: Model<Document<IIes>>) {
    this.collection = model.collection;
    this.db = model.db;
  }
  async getQuestionsTheme(): Promise<any[]> {
    const result: any = await this.db
      .collection("tema_questao_2017")
      .aggregate([
        {
          $group: {
            _id: "$tema",
            questions: { $push: "$questao" },
            qtQuestions: {$sum: 1}
          },
        },
      ]).toArray();
    return result;
  }
  async getIes(query: Object) {
    const ies: IIes[] = (await this.collection
      .find(query, {
        projection: {
          cod_ies: 1,
          sigla: 1,
          municipio: 1,
          uf: 1,
        },
      })
      .toArray()) as unknown as IIes[];

    return ies;
  }
}
