import { ApiResponse } from "@/common/api/api-response";

export class GetUserController {
  constructor() {}

  async handle() {
    return ApiResponse.success({ users: null }, "Success.");
  }
}
