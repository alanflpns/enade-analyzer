import { model, Schema, Document } from "mongoose";
import { IMicrodata } from "../../../../domain/microdata/interfaces/microdata.interface";

const microdataSchema = new Schema(
  {},
  { collection: "microdados", versionKey: false }
);

export const MicrodataModel = model<Document<IMicrodata>>(
  "microdados",
  microdataSchema
);
