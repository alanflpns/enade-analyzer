import { model, Schema, Document } from "mongoose";
import { IMicrodata } from "../../../../domain/microdata/interfaces/microdata.interface";

const microdataSchema = new Schema(
  {},
  { collection: "microdata_enade_2017", versionKey: false }
);

export const MicrodataModel = model<Document<IMicrodata>>(
  "microdata_enade_2017",
  microdataSchema
);
