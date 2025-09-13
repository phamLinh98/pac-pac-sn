export function extractUniqueUsers(list) {
    const uniqueUsers = new Map(); // Sử dụng Map để tối ưu hơn object nếu key là số lớn
    
    for (const item of list) {
        const userId = item.user_id;
        if (!uniqueUsers.has(userId)) {
            uniqueUsers.set(userId, {
                id: item.id,
                name: item.name,
                avatar: item.avatar
            });
        }
    }
    
    return Array.from(uniqueUsers.values());
}
