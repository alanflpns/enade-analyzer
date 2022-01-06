import { IMicrodata } from "./microdata.interface";

export default interface IMicrodataRepository {
  getMicrodataResume(query: Object, ano: number): Promise<IMicrodata[]>;
}
