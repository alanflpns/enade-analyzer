import { IIes } from "./ies.interface";

export default interface IIesRepository {
  getIes(query: Object): Promise<IIes[]>;
  getQuestionsTheme(): Promise<any[]>;
}
