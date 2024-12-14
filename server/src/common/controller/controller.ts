import type { ApiResponse } from "../api/api-response";

export interface Controller<T = any> {
  handle: (request: T) => Promise<ApiResponse<unknown>>;
}

export interface Event<T = any> {
  execute: (request: T) => Promise<void>;
}
