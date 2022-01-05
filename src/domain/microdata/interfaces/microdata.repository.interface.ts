import { IMicrodata } from "./microdata.interface";

export default interface IMicrodataRepository {
  getMicrodataResume(): Promise<IMicrodata[]>;
}
