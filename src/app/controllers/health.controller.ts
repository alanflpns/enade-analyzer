import express, { Request, Response, Router } from "express";
import { IController } from "./controller.interface";
import { name, version } from "./../../../package.json";

class HealthController implements IController {
  private router: Router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get("/health", this.health);
  }

  public getRoutes(): Router {
    return this.router;
  }

  health = async (req: Request, res: Response) => {
    const result = {
      health: true,
      name,
      version,
      port: process.env.PORT || 3000,
    };
    res.send(result);
  };
}

export default HealthController;
