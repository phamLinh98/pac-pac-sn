import { envConfig } from "../configs/envConfig";

export const getApi = async (route) => {
  try {
    const url = `${envConfig.host}${route}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        try {
          const refreshResponse = await fetch(`${envConfig.host}/refesh-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });
          
          if (refreshResponse.ok) {
            // Thực hiện lại request ban đầu sau khi refresh token thành công
            response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
            });
          } else {
            throw new Error('Refresh token failed');
          }
        } catch(error) {
          console.log('Refresh token error:', error);
          throw error;
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
    }
    return response;
  } catch (error) {
    console.log('API error:', error);
    throw error;
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

