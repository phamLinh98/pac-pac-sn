export const getLastWord = (str) => {
    if (!str || typeof str !== "string") return null; // Kiểm tra chuỗi đầu vào
    const words = str.trim().split(/\s+/); // Tách chuỗi thành các từ
    return words[words.length - 1] || null; // Lấy từ cuối cùng
  };
  