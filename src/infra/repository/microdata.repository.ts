import { Collection, Document, Model } from "mongoose";
import { IMicrodata } from "../../domain/microdata/interfaces/microdata.interface";
import IMicrodataRepository from "../../domain/microdata/interfaces/microdata.repository.interface";

export class MicrodataRepository implements IMicrodataRepository {
  private readonly collection: Collection;
  constructor(model: Model<Document<IMicrodata>>) {
    this.collection = model.collection;
  }
  async getMicrodataResume(): Promise<IMicrodata[]> {
    return [];
  }
}
