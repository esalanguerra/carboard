import express from "express";
import {UsersRouter} from "../infra/routes/user-routes";

export class Server {
  public readonly app: express.Application;

  public readonly usersRouter: UsersRouter;

  constructor() {
    this.app = express();

    this.usersRouter = new UsersRouter();
  }

  public async start() {
    this.app.use("/v1/users", this.usersRouter.registerRoutes());
    
    this.app.listen(process.env.APP_PORT || 3333, async () => {
      console.log(
        `Main server has ben started on port *${process.env.APP_PORT}`
      );
    });
  }
}
