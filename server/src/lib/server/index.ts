import express from "express";
import cors from "cors";
import { UsersRouter } from "../infra/routes/user-routes";

export class Server {
  public readonly app: express.Application;

  public readonly usersRouter: UsersRouter;

  constructor() {
    this.app = express();

    this.usersRouter = new UsersRouter();
  }

  public async start() {
    this.app.use(
      cors({
        exposedHeaders: ["x-total-count", "Content-Type", "Content-Length"],
      })
    );

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use("/v1/users", this.usersRouter.registerRoutes());

    this.app.listen(process.env.APP_PORT || 3333, async () => {
      console.log(
        `Main server has ben started on port *${process.env.APP_PORT}`
      );
    });
  }
}
