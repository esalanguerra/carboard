import axios from "axios";

export const apiRequest = async ({ method, url, data, parameters }) => {
  console.log("API Request", { method, url, data, parameters });
  const config = {
    method,
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    data,
    params: parameters,
  };

  try {
    const response = await axios(config);

    return response.data;
  } catch (error) {
    return error?.response?.data || { message: "Something went wrong." };
  }
};
