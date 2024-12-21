CREATE TABLE user (
    id SERIAL PRIMARY KEY, -- Tự động tăng ID
    name VARCHAR(255) NOT NULL, -- Tên người dùng
    email VARCHAR(255) UNIQUE NOT NULL, -- Email phải là duy nhất
    password VARCHAR(255) NOT NULL, -- Mật khẩu được mã hóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Ngày cập nhật
);

INSERT INTO user (name, email, password)
VALUES
    ('John Doe', 'johndoe@example.com', 'hashed_password_123'),
    ('Jane Smith', 'janesmith@example.com', 'hashed_password_456'),
    ('Alice Nguyen', 'alicenguyen@example.com', 'hashed_password_789');
