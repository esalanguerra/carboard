import axios from "axios";

const BASE_URL = "http://localhost:3333";

export const apiRequest = async (method, url, data) => {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${url}`,
            data,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}