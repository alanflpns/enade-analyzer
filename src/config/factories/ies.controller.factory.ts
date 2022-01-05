import { IController } from "../../app/controllers/controller.interface";
import { IesController } from "../../app/controllers/ies.controller";
import { IesService } from "../../domain/ies/ies.service";
import { IesRepository } from "../../infra/repository/ies.repository";

export class IesControllerFactory {
  static create(): IController {
    return new IesController(new IesService(new IesRepository()));
  }
}
