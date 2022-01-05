import express, { Request, Response, Router } from "express";
import { MicrodataService } from "../../domain/microdata/microdata.service";
import { IController } from "./controller.interface";

export class MicrodataController implements IController {
  private router: Router = express.Router();

  private service: MicrodataService;

  constructor(service: MicrodataService) {
    this.service = service;
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get("/api/microdata", this.getMicrodataResume);
  }

  public getRoutes(): Router {
    return this.router;
  }

  getMicrodataResume = async (req: Request, res: Response) => {
    const result = await this.service.getMicrodataResume()
    res.send(result);
  };
}
