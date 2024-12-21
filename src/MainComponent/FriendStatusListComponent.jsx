import { Button, Card, Space } from "antd"
import { UploadImage } from "../SideComponent/UploadImage";
import { VscShare } from "react-icons/vsc";
import { SlLike } from "react-icons/sl";
import { useState } from "react";
import { FriendStatusButtonModalComponent } from "./FriendStatusContentDetailsComponent";

// fake account friends
const user = {
    name: "Lê Thị Ánh Huyền",
    time: "10 phút",
  };
  
export const FriendStatusListComponent = () => {
  const text = "Apollo 7 là chuyến bay có người lái đầu tiên thuộc chương trình không gian Apollo của NASA. Sứ mệnh cũng chứng kiến ​​cơ quan này tiếp tục các chuyến bay đưa con người vào vũ trụ kể từ sau vụ hỏa hoạn khiến ba phi hành gia Apollo 1 thiệt mạng trong cuộc thử nghiệm diễn tập cho phi vụ phóng vào ngày 27 tháng 1 năm 1967. Chỉ huy của phi hành đoàn Apollo 7 là Walter M. Schirra, với Donn F. Eisele làm phi công mô-đun chỉ huy và R. Walter Cunningham đảm nhiệm chức vụ phi công mô-đun Mặt Trăng (ông đã được chỉ định như vậy mặc dù Apollo 7 không mang theo Mô-đun Mặt Trăng). Ba phi hành gia này ban đầu được lựa chọn để tham gia chuyến bay có người lái thứ hai trong chương trình Apollo và sau đó trở thành phi hành đoàn dự phòng cho Apollo 1.";
  const maxLength = 50; // Đặt giới hạn ký tự mỗi dòng

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
    
  return <Card title={`${user.name} đã đăng tải bài viết (10p)`} size="small">
    <div>
      <p>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}{" "}
        <span
          onClick={handleClick}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isExpanded ? "Ẩn bớt" : " xem tiếp"}{" "}
        </span>
      </p>
    </div>
    <UploadImage />
    <Space
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <Button><SlLike /> Like</Button>
      <FriendStatusButtonModalComponent/>
      <Button><VscShare />Share</Button>
    </Space>
  </Card>
}
