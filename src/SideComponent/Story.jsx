import { useRef } from "react";
import { Card } from "antd";
import { ImageStatus } from "./ImageStatus";
import { useFacadeStory } from "../reduxs/useFacadeStory";
import { PiHeartbeatBold } from "react-icons/pi";
import { ImReply } from "react-icons/im";
import { RiUserUnfollowFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "./LoadingComponent";
const { Meta } = Card;

export const AllStory = () => {
  // Sử dụng ref để truy cập container
  const containerRef = useRef(null);
  const { story, loadingStory } = useFacadeStory();
  const navigate = useNavigate();
  const moveToProfileUser = (userId) => {
    navigate(`/profile/${userId}`)
  }
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
        {loadingStory ? <LoadingComponent /> : story.map((item, index) => (
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
              <ImageStatus image={item.image} width={150} height={250}/>
            }
            actions={[
              <PiHeartbeatBold key="setting" style={{ fontSize: "1.5rem", color: "red" }} />,
              <ImReply key="edit" style={{ fontSize: "1.3rem" }} />,
              <RiUserUnfollowFill key="ellipsis" style={{ fontSize: "1.3rem" }} />,
            ]}
          >
            <Meta title={`${item.user_name}`} onClick={()=>moveToProfileUser(item.user_id)} style={{textAlign: "center"}}/>
          </Card>
        ))}
      </div>
    </div>
  );
};


