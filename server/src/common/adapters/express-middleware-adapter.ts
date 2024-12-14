import type { Request, Response, NextFunction } from "express";
import type { Middleware } from "../middleware";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const requestData = {
        accessToken: request.headers?.["x-access-token"],
        ...(request.headers || {}),
        ...(request.body || {}),
        ...(request.params || {}),
        ...(request.query || {}),
        // @ts-ignore
        user: request.user,
        validation: {
          query: request.query,
          body: request.body,
          params: request.params,
          // @ts-ignore
          file: request.file || request.body.file,
        },
      };

      const httpResponse = await middleware.handle(requestData, request.body);

      Object.assign(request, httpResponse.data);
      return next();
    } catch (error) {
      next(error);
    }
  };
};
