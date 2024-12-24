import { envConfig } from "../configs/envConfig";

export const getApi = async (route) => {
    try {
        const url = `${envConfig.host}${route}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status:${response.status}`);
        }
        return response;
    } catch (error) {
        console.log('error', error)
    }
}
