CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    content JSONB,
    like INT,
    shared INT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    images TEXT[] -- Thêm trường images kiểu mảng chuỗi
);


INSERT INTO list (title, image, like_count, shared_count) 
VALUES ('Hom nay la thu may', 'anh123.jpg', 100, 100);
