export const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]; // Lấy phần payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Lỗi giải mã JWT:", error);
      return null;
    }
  }