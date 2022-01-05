import { model, Schema, Document } from "mongoose";
import { IIes } from "../../../../domain/ies/interfaces/ies.interface";

const iesSchema = new Schema(
  {
    cod_ies: {
      type: Number,
      required: true,
    },
    sigla: {
      type: String,
      required: true,
    },
    municipio: {
      type: String,
      required: true,
    },
    uf: {
      type: String,
      required: true,
    },
  },
  { collection: "ies", versionKey: false }
);

export const IesModel = model<Document<IIes>>("ies", iesSchema);
