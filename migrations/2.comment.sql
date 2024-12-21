CREATE TABLE comments (
    id SERIAL PRIMARY KEY,               -- ID duy nhất cho mỗi bình luận
    post_id INT NOT NULL,                -- ID bài đăng mà bình luận thuộc về
    content TEXT NOT NULL,               -- Nội dung bình luận
    user_id INT NOT NULL,                -- ID người dùng đăng bình luận (giả sử có bảng user)
    created_at TIMESTAMP DEFAULT NOW(),  -- Thời gian tạo bình luận
    updated_at TIMESTAMP DEFAULT NOW(),  -- Thời gian cập nhật bình luận gần nhất
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE -- Liên kết với bảng posts
);

INSERT INTO comments (post_id, content, user_id) 
VALUES (1, 'Bài viết rất hay!', 123);
