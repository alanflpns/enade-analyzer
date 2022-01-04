import { IDatabase } from "../../infra/db/database.interface";
import { MongooseDatabase } from "../../infra/db/mongo/database";

const dbUri = String(process.env.DATABASE_URI);
const dbName = String(process.env.DATABASE_NAME);

export class DatabaseMongooseFactory {
  static create(): IDatabase {
    return new MongooseDatabase(dbUri, dbName);
  }
}
