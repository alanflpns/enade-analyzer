import express, { Application, RequestHandler } from "express";
import { Logger } from "traceability";
import { IDatabase } from "./infra/db/database.interface";
import { IController } from "./app/controllers/controller.interface";
import dotenv from "dotenv";
dotenv.config();

export class App {
  public app: Application;

  public port: number;

  private readonly database: IDatabase;

  constructor(appInit: {
    port: number;
    middleWares: Array<RequestHandler>;
    controllers: Array<IController>;
    database: IDatabase;
    customizers: Array<(application: Application) => void>;
  }) {
    this.app = express();
    this.port = appInit.port;

    this.database = appInit.database;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.customizers(appInit.customizers);
  }

  private customizers(customizers: Array<(application: Application) => void>) {
    customizers.forEach((customizer) => customizer(this.app));
  }

  private middlewares(middleWares: Array<RequestHandler>) {
    middleWares.forEach((middleWare) => this.app.use(middleWare));
  }

  private routes(controllers: Array<IController>, pathRoute = "/") {
    controllers.forEach((controller) =>
      this.app.use(pathRoute, controller.getRoutes())
    );
  }

  public async databaseSetup() {
    await this.database.start();
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on the http://localhost:${this.port}`, {
        eventName: "start_listening",
        process: "Application",
      });
    });
  }
}
