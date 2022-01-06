import { IMicrodata } from "./microdata.interface";

export default interface IMicrodataRepository {
  getMicrodataResume(query: Object, ano: string): Promise<IMicrodata[]>;
}
