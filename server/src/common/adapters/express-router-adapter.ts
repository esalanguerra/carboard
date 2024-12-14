import type { NextFunction, Request, Response } from "express";
import type { Controller } from "../controller/controller";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const requestData = {
        ...request.body,
        ...request.params,
        ...request.query, //
        clientIp: request.headers["x-forwarded-for"],
        // @ts-ignore
        user: request.user,
        // @ts-ignore
        file: request.file || request.body.file,
        platform: request.headers["platform"],
      };

      const httpResponse = await controller.handle(requestData);
      return response.status(httpResponse.code).json(httpResponse);
    } catch (error) {
      next(error);
    }
  };
};
