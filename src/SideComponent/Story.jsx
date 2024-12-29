import { useRef } from "react";
import { Card } from "antd";
import { ImageStatus } from "./ImageStatus";
import { useFacadeStory } from "../reduxs/useFacadeStory";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";
const { Meta } = Card;

export const AllStory = () => {
  // Sử dụng ref để truy cập container
  const containerRef = useRef(null);
  const { story, loadingStory } = useFacadeStory();
  return (
    <div
      style={{
        width: "95%", // Chiều rộng của container chiếm toàn bộ không gian
        overflowX: "hidden", // Ẩn thanh cuộn mặc định
        position: "relative", // Để đặt các nút cuộn bên ngoài container
      }}
    >
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
        {story && story.map((item, index) => (
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
            actions={[
              <CiHeart key="setting" style={{ fontSize: "1.5rem", color: "red" }} />,
              <FaRegCommentDots key="edit" style={{ fontSize: "1.3rem" }} />,
              <BiSolidHide key="ellipsis" style={{ fontSize: "1.3rem" }} />,
            ]}
          >
            <Meta title={`${item.user_name}`} />
          </Card>
        ))}
      </div>
    </div>
  );
};


