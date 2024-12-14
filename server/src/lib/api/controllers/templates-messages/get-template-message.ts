import { ApiResponse } from "@/common/api/api-response";
import { Controller } from "@/common/controller/controller";

export class GetTemplateMessageController implements Controller {
  constructor() {}

  async handle() {
    return ApiResponse.success({ template: null }, "Success.");
  }
}
