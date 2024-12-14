import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { UsersRouter } from "../infra/routes/user-routes";

export class Server {
  public readonly app: express.Application;
  public readonly usersRouter: UsersRouter;

  constructor() {
    this.app = express();
    this.usersRouter = new UsersRouter();
  }

  public async start() {
    this.app.use(compression());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );
    this.app.use(helmet.xssFilter());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.frameguard({ action: "deny" }));
    this.app.use(helmet.referrerPolicy({ policy: "strict-origin" }));

    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["x-total-count", "Content-Type", "Content-Length"],
      })
    );

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use("/v1/users", this.usersRouter.registerRoutes());

    this.app.listen(process.env.APP_PORT || 3333, async () => {
      console.log(
        `Main server has been started on port *${process.env.APP_PORT}`
      );
    });
  }
}
