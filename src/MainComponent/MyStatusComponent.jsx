import { Button, Card, Space } from "antd";
import { BsFillImageFill } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { MyStatusButtonModalComponent } from "./MyStatusButtonModalComponent";
import { TfiThemifyFavicon } from "react-icons/tfi";

// Login User now , bài đăng 
const loginUser = "Rin";
export const MyStatusComponent = () => {
  return (
    <Card title={`${loginUser} ơi nay bạn có tin gì mới không ?`} size="small">
      <Space
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <MyStatusButtonModalComponent>
          <TfiThemifyFavicon />
          New Status
        </MyStatusButtonModalComponent>
        <MyStatusButtonModalComponent>
           <BsFillImageFill />
           Image
        </MyStatusButtonModalComponent>
        <Button>
          <RiLiveLine />
          Live
        </Button>
      </Space>
    </Card>
  );
};
