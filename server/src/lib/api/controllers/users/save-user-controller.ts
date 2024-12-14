import { ApiResponse } from "@/common/api/api-response";

export class SaveUserController {
  constructor() {}

  async handle() {
    return ApiResponse.success({ user: null }, "Success.");
  }
}
