import { ApiResponse } from "@/common/api/api-response";
import {Controller} from "@/common/controller/controller";

export class GetUserController implements Controller {
  constructor() {}

  async handle() {
    return ApiResponse.success({ users: null }, "Success.");
  }
}
