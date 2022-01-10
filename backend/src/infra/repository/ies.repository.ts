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
  async getQuestionsTheme(ano: number, CO_GRUPO: number): Promise<any[]> {
    const result: any = await this.db
      .collection(`tema_questao`)
      .aggregate([
        {
          $match: {
            ano,
            CO_GRUPO,
          },
        },
        {
          $group: {
            _id: "$tema",
            questions: { $push: "$questao" },
            qtQuestions: { $sum: 1 },
          },
        },
        {
          $project: {
            tema: "$_id",
            questions: 1,
            qtQuestions: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            tema: 1,
          },
        },
      ])
      .toArray();
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
