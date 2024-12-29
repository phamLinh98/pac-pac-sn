import { useRef } from "react";
import { Card } from "antd";
import { ImageStatus } from "./ImageStatus";
import { useFacadeStory } from "../reduxs/useFacadeStory";
const { Meta } = Card;

export const AllStory = () => {
  // Sử dụng ref để truy cập container
  const containerRef = useRef(null);
  // Cuộn sang trái
  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  // Cuộn sang phải
  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const { story, loadingStory } = useFacadeStory();
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
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
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
        {story && story.map((item,index) => (
          <Card
            key={index}
            hoverable
            style={{
              width: 150,
              display: "inline-block",
              marginRight: "5px",
              marginBottom: "5px"
            }}
            cover={
              <ImageStatus image={item.image} width={150} />
            }
          > 
            <Meta title={`${item.user_name}`} />
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
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
      </button>
    </div>
  );
};


