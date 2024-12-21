CREATE TABLE replies (
    id SERIAL PRIMARY KEY,               -- ID duy nhất cho mỗi phản hồi
    comment_id INT NOT NULL,             -- ID của bình luận mà phản hồi thuộc về
    content TEXT NOT NULL,               -- Nội dung phản hồi
    user_id INT NOT NULL,                -- ID người dùng đăng phản hồi
    created_at TIMESTAMP DEFAULT NOW(),  -- Thời gian tạo phản hồi
    updated_at TIMESTAMP DEFAULT NOW(),  -- Thời gian cập nhật phản hồi gần nhất
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE -- Liên kết với bảng comments
);

INSERT INTO replies (comment_id, content, user_id) 
VALUES (1, 'Cảm ơn bạn nhé!', 124), 
       (1, 'Đồng ý, bài viết rất hữu ích!', 125);
