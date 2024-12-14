import { ApiResponse } from "@/common/api/api-response";

export class SearchUsersController {
  constructor() {}

  async handle() {
    return ApiResponse.success({ user: null }, "Success.");
  }
}
