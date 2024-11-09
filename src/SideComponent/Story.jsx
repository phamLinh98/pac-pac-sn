import { useRef } from "react";
import { Card } from "antd";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
const { Meta } = Card;

export const Story = () => {
  const containerRef = useRef(null); // Sử dụng ref để truy cập container

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200; // Cuộn sang trái
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200; // Cuộn sang phải
    }
  };

  return (
    <div
      style={{
        width: "95%", // Chiều rộng của container chiếm toàn bộ không gian
        overflowX: "hidden", // Ẩn thanh cuộn mặc định
        position: "relative", // Để đặt các nút cuộn bên ngoài container
      }}
    >
      <button
        onClick={handleScrollLeft}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.3)",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        <TiChevronLeft />
      </button>

      <div
        ref={containerRef}
        style={{
          display: "flex", // Dùng flex để các thẻ card không bị ngắt dòng
          padding: "10px 0", // Thêm khoảng cách trên dưới
          overflowX: "auto", // Cho phép cuộn ngang
          whiteSpace: "nowrap", // Đảm bảo các thẻ card không bị ngắt dòng
          scrollbarWidth: "none", // Ẩn thanh cuộn cho Firefox
        }}
      >
        {[...Array(10)].map((_, index) => (
          <Card
            key={index}
            hoverable
            style={{
              width: 150, // Chiều rộng của mỗi thẻ
              display: "inline-block", // Đảm bảo các thẻ không bị ngắt dòng
              marginRight: "16px", // Khoảng cách giữa các thẻ
            }}
            cover={
              <img
                alt="example"
                src="https://rrdarlkddjxzqbcojwdc.supabase.co/storage/v1/object/public/image-uploads/Radish_Spirit.webp"
              />
            }
          >
            <Meta title={`Lê Thu Huyền ${index + 1}`} />
          </Card>
        ))}
      </div>

      <button
        onClick={handleScrollRight}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.3)",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        <TiChevronRight />
      </button>
    </div>
  );
};


