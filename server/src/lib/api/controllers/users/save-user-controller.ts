import { ApiResponse } from "@/common/api/api-response";
import {Controller} from "@/common/controller/controller";

export class SaveUserController implements Controller {
  constructor() {}

  async handle() {
    return ApiResponse.success({ user: null }, "Success.");
  }
}
