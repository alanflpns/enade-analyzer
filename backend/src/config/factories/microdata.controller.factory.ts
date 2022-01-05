import { IController } from "../../app/controllers/controller.interface";
import { MicrodataController } from "../../app/controllers/microdata.controller";
import { IesService } from "../../domain/ies/ies.service";
import { MicrodataService } from "../../domain/microdata/microdata.service";
import { IesModel } from "../../infra/db/mongo/model/ies.model";
import { MicrodataModel } from "../../infra/db/mongo/model/microdata.model";
import { IesRepository } from "../../infra/repository/ies.repository";
import { MicrodataRepository } from "../../infra/repository/microdata.repository";

export class MicrodataControllerFactory {
  static create(): IController {
    const iesService = new IesService(new IesRepository(IesModel));
    return new MicrodataController(
      new MicrodataService(
        new MicrodataRepository(MicrodataModel.db),
        iesService
      )
    );
  }
}
