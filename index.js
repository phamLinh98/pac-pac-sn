function extractUniqueUsers(list) {
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

// Ví dụ sử dụng với dữ liệu của bạn:
const list = [
    {
        "id": 10,
        "user_id": 789,
        "content": {
            "images": [
                "https://i.pinimg.com/736x/78/e6/cf/78e6cf22df3dce593661888bba82add1.jpg"
            ]
        },
        "like": 0,
        "shared": 0,
        "comment": 0,
        "created_at": null,
        "updated_at": null,
        "likestatus": 0,
        "namecode": "WatanabeYasuyuki",
        "name": "渡辺康幸",
        "avatar": "https://i.pinimg.com/736x/73/64/de/7364decfd1bda940bdfbd83c7e51c90c.jpg",
        "friends": 1000
    },
    {
        "id": 7,
        "user_id": 567,
        "content": {
            "title": "Tình đơn phương"
        },
        "like": 100,
        "shared": 10,
        "comment": 0,
        "created_at": "2024-12-23T04:18:45.000Z",
        "updated_at": "2024-12-23T04:18:45.000Z",
        "likestatus": 1,
        "namecode": "IzukaPham",
        "name": "Du Du Du",
        "avatar": "https://i.pinimg.com/736x/02/a6/c3/02a6c34aa1bd7ed6837bb75f37e61dff.jpg",
        "friends": 100
    },
    {
        "id": 5,
        "user_id": 567,
        "content": {
            "title": "Muốn rủ em ăn sáng, nhưng sợ thành bữa sáng của em",
            "images": [
                "https://i.pinimg.com/736x/e2/5e/3f/e25e3ff097f9569b63ec39a70d571c84.jpg",
                "https://i.pinimg.com/736x/ba/e9/c8/bae9c86bc683f13cffa638b56a4124b2.jpg"
            ]
        },
        "like": 5,
        "shared": 1,
        "comment": 0,
        "created_at": "2024-12-23T04:18:45.000Z",
        "updated_at": "2024-12-23T04:18:45.000Z",
        "likestatus": 0,
        "namecode": "IzukaPham",
        "name": "Du Du Du",
        "avatar": "https://i.pinimg.com/736x/02/a6/c3/02a6c34aa1bd7ed6837bb75f37e61dff.jpg",
        "friends": 100
    },
    {
        "id": 8,
        "user_id": 567,
        "content": {
            "images": [
                "https://i.pinimg.com/736x/e4/0d/d3/e40dd37a663ee3d840777388c4fc559a.jpg",
                "https://i.pinimg.com/736x/2b/60/5d/2b605d88edae7a66582ecc6407d65b1b.jpg",
                "https://i.pinimg.com/736x/2f/ef/5e/2fef5ece8370e0720552f4f1ee5b3fdc.jpg",
                "https://i.pinimg.com/736x/ee/cc/d8/eeccd8d799d51f011eca441bd057cb0f.jpg"
            ]
        },
        "like": 45,
        "shared": 11,
        "comment": 0,
        "created_at": "2024-12-23T04:18:45.000Z",
        "updated_at": "2024-12-23T04:18:45.000Z",
        "likestatus": 1,
        "namecode": "IzukaPham",
        "name": "Du Du Du",
        "avatar": "https://i.pinimg.com/736x/02/a6/c3/02a6c34aa1bd7ed6837bb75f37e61dff.jpg",
        "friends": 100
    }
];

console.log(extractUniqueUsers(list));
// Kết quả: [
//   { id: 10, name: '渡辺康幸', avatar: 'https://i.pinimg.com/736x/73/64/de/7364decfd1bda940bdfbd83c7e51c90c.jpg' },
//   { id: 7, name: 'Du Du Du', avatar: 'https://i.pinimg.com/736x/02/a6/c3/02a6c34aa1bd7ed6837bb75f37e61dff.jpg' }
// ]