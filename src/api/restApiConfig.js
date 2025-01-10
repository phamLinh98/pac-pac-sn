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

export const loginByEmailAndPassword = async (email, password) => {
    try {
        const url = `${envConfig.host}/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', //Quan trọng để gửi cookie
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Đã xảy ra lỗi khi đăng nhập"); // sửa message thành error
        }
       return true; // Trả về true nếu thành công
    } catch (error) {
        console.error("Error in loginByEmailAndPassword:", error);
        throw error;
    }
};

