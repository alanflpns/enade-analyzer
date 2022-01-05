import { readFileSync } from "fs";
import { Application, NextFunction, Request, Response } from "express";
import { Logger } from "traceability";
import { stringify } from "querystring";
import * as path from "path";
import * as OpenApiValidator from "express-openapi-validator";
import * as swaggerUI from "swagger-ui-express";
import * as YAML from "js-yaml";

const OPEN_API_SPEC_FILE_LOCATION = path.join(
  __dirname,
  "..",
  "contracts/analyzer-enade.yaml"
);

export const swaggerAppCustomizer = (app: Application) => {
  function loadDocumentSync(file: string): any {
    return YAML.load(readFileSync(file, "utf8"));
  }

  const swaggerDoc = loadDocumentSync(OPEN_API_SPEC_FILE_LOCATION.toString());
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
};
export const validationAppCustomizer = (app: Application) => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(JSON.stringify(err));

    return res.status(err.status || 500).json(err);
  });
};

export const validatorMiddleware = OpenApiValidator.middleware({
  apiSpec: OPEN_API_SPEC_FILE_LOCATION,
  validateRequests: true,
  validateResponses: true,
  validateFormats: "full",
});
