import type { ApiResponse } from "./api/api-response"

export interface Middleware<T = any, U = any> {
  handle: (
    httpRequest: T,
    httpBody?: U
  ) => Promise<ApiResponse<unknown | false>>;
}
