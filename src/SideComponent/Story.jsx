import { useRef } from "react";
import { Card } from "antd";
import { ImageStatus } from "./ImageStatus";
import { useFacadeStory } from "../reduxs/useFacadeStory";
import { PiHeartbeatBold } from "react-icons/pi";
import { ImReply } from "react-icons/im";
import { RiUserUnfollowFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "./LoadingComponent";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
const { Meta } = Card;

export const AllStory = () => {
  // Sử dụng ref để truy cập container
  const containerRef = useRef(null);
  const { story, loadingStory } = useFacadeStory();
  const navigate = useNavigate();
  const moveToProfileUser = (userId) => {
    navigate(`/profile/${userId}`)
  }
  const getUserFromLocalStorage = localStorage.getItem('accessToken');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id } = getData;

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
        <div style={{ display: 'flex' }}> {/* Container Flexbox */}
          {loadingStory ? <LoadingComponent /> : story.map((item, index) => (
            <Card
              key={index}
              hoverable
              style={{
                width: 150,
                marginRight: "5px",
                marginBottom: "5px",
                order: item.user_id === id ? -1 : 0, // Đặt item có user_id === id từ localstorage lên đầu
              }}
              cover={
                <ImageStatus image={item.image} width={150} height={250} active={false} />
              }
              actions={[
                <PiHeartbeatBold key="setting" style={{ fontSize: "1.5rem", color: "red" }} />,
                <ImReply key="edit" style={{ fontSize: "1.3rem" }} />,
                <RiUserUnfollowFill key="ellipsis" style={{ fontSize: "1.3rem" }} />,
              ]}
            >
              <Meta title={id !== item.user_id ? `${item.user_name}` : 'Bạn'} onClick={() => moveToProfileUser(item.user_id)} style={{ textAlign: "center" }} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


