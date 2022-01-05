import { Connection, Document, Model } from "mongoose";
import { IMicrodata } from "../../domain/microdata/interfaces/microdata.interface";
import IMicrodataRepository from "../../domain/microdata/interfaces/microdata.repository.interface";

export class MicrodataRepository implements IMicrodataRepository {
  private readonly db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  async getMicrodataResume(query: Object): Promise<IMicrodata[]> {
    const microdataId2017 = (
      await this.db
        .collection("microdata_enade_2017")
        .aggregate([
          {
            $match: {
              ...query,
              //CO_GRUPO é o curso de sistemas de informação
              //TP_PR é o tipo de presença do aluno, código 555 significa que o resultado da prova dele é válido
              CO_GRUPO: 4006,
              TP_PR_OB_CE: 555,
              TP_PR_GER: 555,
              TP_PRES: 555,
            },
          },
        ])
        .toArray()
    ).map((item) => item._id);

    const result = await this.db
      .collection("respostas_enade_2017")
      .aggregate([
        {
          $match: {
            microdataId: { $in: microdataId2017 },
          },
        },
        {
          $group: {
            _id: {
              questao: "$questao",
              resposta: "$resposta",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "tema_questao_2017",
            localField: "_id.questao",
            foreignField: "questao",
            as: "temaObj",
          },
        },
        {
          $unwind: "$temaObj",
        },
        {
          $group: {
            _id: {
              tema: "$temaObj.tema",
              resposta: "$_id.resposta",
            },
            count: {
              $sum: "$count",
            },
          },
        },
        {
          $group: {
            _id: "$_id.tema",
            result: {
              $push: {
                resposta: "$_id.resposta",
                count: "$count",
              },
            },
            total: { $sum: "$count" },
          },
        },
      ])
      .toArray();
    return result as any;
  }
}
