CREATE TABLE list (
    id SERIAL PRIMARY KEY,               -- ID bài đăng
    title TEXT NOT NULL,                 -- Tiêu đề bài đăng
    image VARCHAR(255),                  -- Đường dẫn hình ảnh
    like_count INT DEFAULT 0,            -- Số lượt thích
    shared_count INT DEFAULT 0,          -- Số lượt chia sẻ
    created_at TIMESTAMP DEFAULT NOW(),  -- Thời gian tạo bài đăng
    updated_at TIMESTAMP DEFAULT NOW()   -- Thời gian cập nhật bài đăng
);

INSERT INTO list (title, image, like_count, shared_count) 
VALUES ('Hom nay la thu may', 'anh123.jpg', 100, 100);
