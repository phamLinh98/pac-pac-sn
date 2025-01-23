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
        try {
          await fetch(`${envConfig.host}/refesh-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });
        } catch(error) {
          console.log(error);
        }
      }
      await response.json();
    }
    return response;
  } catch (error) {
    console.log(error);
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
      await response.json();
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

export const logoutClearToken = async (route) => {
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

