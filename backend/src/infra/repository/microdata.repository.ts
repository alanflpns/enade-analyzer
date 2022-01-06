import { Connection, Document, Model } from "mongoose";
import { IMicrodata } from "../../domain/microdata/interfaces/microdata.interface";
import IMicrodataRepository from "../../domain/microdata/interfaces/microdata.repository.interface";

export class MicrodataRepository implements IMicrodataRepository {
  private readonly db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  async getMicrodataResume(query: Object, ano: number): Promise<IMicrodata[]> {
    const result = await this.db
      .collection(`microdados`)
      .aggregate([
        {
          $match: {
            ...query,
            NU_ANO: ano,
            //CO_GRUPO é o curso de sistemas de informação
            //TP_PR é o tipo de presença do aluno, código 555 significa que o resultado da prova dele é válido
            CO_GRUPO: 4006,
            TP_PR_OB_CE: 555,
            TP_PR_GER: 555,
            TP_PRES: 555,
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
        {
          $lookup: {
            from: "respostas_enade",
            localField: "_id",
            foreignField: "microdataId",
            as: "respostas",
          },
        },
        {
          $unwind: "$respostas",
        },
        {
          $group: {
            _id: {
              questao: "$respostas.questao",
              resposta: "$respostas.resposta",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $match: {
            "_id.resposta": {
              $ne: undefined,
            },
          },
        },
        {
          $lookup: {
            from: "tema_questao",
            let: {
              ano: 2017,
              questao: "$_id.questao",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$ano", "$$ano"],
                      },
                      {
                        $eq: ["$questao", "$$questao"],
                      },
                    ],
                  },
                },
              },
            ],
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
            total: {
              $sum: "$count",
            },
          },
        },
      ])
      .toArray();
    return result as any;
  }
}
