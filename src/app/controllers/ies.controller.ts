import express, { Request, Response, Router } from "express";
import { IesService } from "../../domain/ies/ies.service";
import { IController } from "./controller.interface";

export class IesController implements IController {
  private router: Router = express.Router();

  private service: IesService;

  constructor(service: IesService) {
    this.service = service;
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get("/api/ies", this.getIesList);
  }

  public getRoutes(): Router {
    return this.router;
  }

  getIesList = async (req: Request, res: Response) => {
    const result = await this.service.getIes()
    res.send(result);
  };
}
