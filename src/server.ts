import express from "express";
import { ContextAsyncHooks } from "traceability";
import { App } from "./app";
import HealthController from "./app/controllers/health.controller";
import {
  swaggerAppCustomizer,
  validationAppCustomizer,
  validatorMiddleware,
} from "./config/api";
import { DatabaseMongooseFactory } from "./config/factories/database.factory";
import { IesControllerFactory } from "./config/factories/ies.controller.factory";
import "./config/logger";

const app = new App({
  port: Number(process.env.PORT) || 3000,
  controllers: [new HealthController(), IesControllerFactory.create()],
  customizers: [swaggerAppCustomizer, validationAppCustomizer],
  database: DatabaseMongooseFactory.create(),
  middleWares: [
    express.json(),
    express.urlencoded({ extended: true }),
    ContextAsyncHooks.getExpressMiddlewareTracking(),
    validatorMiddleware,
  ],
});

app.databaseSetup();
app.listen();
