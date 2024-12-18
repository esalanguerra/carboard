/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestParams {
  method: HttpMethod;
  url: string;
  data?: any;
}

export const apiRequest = async ({
  method,
  url,
  data,
}: RequestParams): Promise<any> => {
  const config: AxiosRequestConfig = {
    method,
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    data,
  };

  try {
    const response: AxiosResponse = await axios(config);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || { message: "Something went wrong." };
  }
};
