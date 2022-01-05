import { IIes } from "./ies.interface";

export default interface IIesRepository {
  getIes(): Promise<IIes[]>;
}
