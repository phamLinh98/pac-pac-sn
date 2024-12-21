import { Button, Card, Space } from "antd";
import { BsFillImageFill } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { MyStatusAreaUploadComponent } from "./MyStatusAreaUploadComponent";
import { TfiThemifyFavicon } from "react-icons/tfi";

// Login User now , bài đăng 
const loginUser = "Rin";
export const MyStatusAreaComponent = () => {
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
        <MyStatusAreaUploadComponent>
          <TfiThemifyFavicon />
          New Status
        </MyStatusAreaUploadComponent>
        <MyStatusAreaUploadComponent>
           <BsFillImageFill />
           Image
        </MyStatusAreaUploadComponent>
        <Button>
          <RiLiveLine />
          Live
        </Button>
      </Space>
    </Card>
  );
};
