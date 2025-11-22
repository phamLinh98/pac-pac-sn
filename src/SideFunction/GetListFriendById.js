export  const extractUniqueUsers = (list) => {
    // Kiểm tra nếu list không phải array hoặc null/undefined
    if (!Array.isArray(list)) {
        return [];
    }
    
    const uniqueUsers = new Map(); // Sử dụng Map để tối ưu hơn object nếu key là số lớn
    
    for (const item of list) {
        const userId = item.user_id;
        if (!uniqueUsers.has(userId)) {
            uniqueUsers.set(userId, {
                id: item.user_id,
                name: item.name,
                avatar: item.avatar
            });
        }
    }
    
    return Array.from(uniqueUsers.values());
}
