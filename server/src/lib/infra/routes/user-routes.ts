import * as Express from "express";
import { makeGetUserDataFactory } from "../factories/http/users/make-get-user-data-factory";
import { makeGetUserFactory } from "../factories/http/users/make-get-user-factory";
import { makeSaveUserFactory } from "../factories/http/users/make-save-user-factory";
import { makeSearchUsersFactory } from "../factories/http/users/make-search-users-factory";
import { makeUpdateUserDataFactory } from "../factories/http/users/make-update-user-factory";
import { adaptRoute } from "@/common/adapters/express-router-adapter";

export class UsersRouter {
  private router: Express.Router;

  constructor() {
    this.router = Express.Router();
  }

  public registerRoutes() {
    this.router.post("/", adaptRoute(makeSaveUserFactory()));

    this.router.get("/:user_id/data", adaptRoute(makeGetUserDataFactory()));

    this.router.get("/:user_id", adaptRoute(makeGetUserFactory()));

    this.router.get("/", adaptRoute(makeSearchUsersFactory()));

    this.router.patch("/:user_id", adaptRoute(makeUpdateUserDataFactory()));

    return this.router;
  }
}
