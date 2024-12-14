import { ApiResponse } from "@/common/api/api-response";

export class UpdateUserDataController {
  constructor() {}

  async handle() {
    return ApiResponse.success({ user: null }, "Success.");
  }
}
