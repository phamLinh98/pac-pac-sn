import { useRef } from "react";
import { Card } from "antd";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { ImageStatus } from "./ImageStatus";
const { Meta } = Card;

export const AllStory = () => {
  const containerRef = useRef(null); // Sử dụng ref để truy cập container
  // Tạm mock List Ảnh
  const imageList = [
    "https://i.pinimg.com/736x/06/8c/41/068c41956bbe1bf9bc051f5222fa6429.jpg",
    "https://i.pinimg.com/736x/94/8d/b4/948db4d850c19147444aa1280fb8a5a4.jpg",
    "https://i.pinimg.com/736x/6a/c5/6c/6ac56c9e41b598dd26d8304f5353b96a.jpg"
  ];
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
            width: 150,
            display: "inline-block",
            marginRight: "16px",
            marginBottom: "16px"
          }}
          cover={
            <ImageStatus image={imageList[index % imageList.length]} width={150}/>
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


