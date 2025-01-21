import { envConfig } from "../configs/envConfig";

export const getApi = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    if (!response.ok) {
      if (response.status === 401) {
        // Nếu là lỗi 401, ném một lỗi đặc biệt
        throw new Error("Unauthorized: 401");
      }
      const errorData = await response.json();
      console.log('123',errorData);
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
  }
}

export const loginByEmailAndPassword = async (email, password) => {
    try {
        const url = `${envConfig.host}/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('123',errorData);
        }
        const responseData = await response.json();
        localStorage.setItem('accessToken', responseData.token);
        return true;
    } catch (error) {
        console.log(error.message);
    }
};

export const refeshTokenWhenExpired = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    return response;
  } catch (error) {
    console.log('error', error.message);
  }
}

