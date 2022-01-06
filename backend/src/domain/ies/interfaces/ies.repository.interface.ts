import { IIes } from "./ies.interface";

export default interface IIesRepository {
  getIes(query: Object): Promise<IIes[]>;
  getQuestionsTheme(ano: number, CO_GRUPO: number): Promise<any[]>;
}
