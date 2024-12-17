import axios from "axios";

export const serverRequest = async (method, url, data) => {
    try {
        const response = await axios({
            method,
            url: `${process.env.NEXT_APP_SERVER_URL}${url}`,
            data,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const apiRequest = async (method, url, data) => {
    try {
        const response = await axios({
            method,
            url: `${process.env.NEXT_APP_API_URL}${url}`,
            data,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}