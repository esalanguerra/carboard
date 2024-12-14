import type { Nullable } from "../types/commom-types";
import { STATUS_CODE } from "../status-code/code";

export class ApiResponse<TData> {
  public readonly code: number;
  public readonly message: string;
  public readonly timestamp: number;
  public readonly data: Nullable<TData>;

  private constructor(code: number, message: string, data?: TData) {
    this.code = code;
    this.message = message;
    this.data = data || null;
    this.timestamp = Date.now();
  }

  public static success<TData>(
    data?: TData,
    message?: string
  ): ApiResponse<TData> {
    const resultCode: number = STATUS_CODE.SUCCESS.code;
    const resultMessage: string = message || STATUS_CODE.SUCCESS.message;

    return new ApiResponse(resultCode, resultMessage, data);
  }

  public static error<TData>(
    code?: number,
    message?: string,
    data?: TData
  ): ApiResponse<TData> {
    const resultCode: number = code || STATUS_CODE.INTERNAL_ERROR.code;
    const resultMessage: string = message || STATUS_CODE.INTERNAL_ERROR.message;

    return new ApiResponse(resultCode, resultMessage, data);
  }
}
