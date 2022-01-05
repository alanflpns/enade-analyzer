import { IController } from "../../app/controllers/controller.interface";
import { MicrodataController } from "../../app/controllers/microdata.controller";
import { MicrodataService } from "../../domain/microdata/microdata.service";
import { MicrodataModel } from "../../infra/db/mongo/model/microdata.model";
import { MicrodataRepository } from "../../infra/repository/microdata.repository";

export class MicrodataControllerFactory {
  static create(): IController {
    return new MicrodataController(new MicrodataService(new MicrodataRepository(MicrodataModel)));
  }
}