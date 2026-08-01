import { Button, Card, Space } from "antd";
import { BsFillImageFill } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { MyStatusAreaUploadComponent } from "./MyStatusAreaUploadComponent";
import { GoStarFill } from "react-icons/go";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

// eslint-disable-next-line react/prop-types
export const MyStatusAreaComponent = ({ onPostCreated }) => {
  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const getData = decodeJwt(getUserFromLocalStorage);
  const {name} = getData;

  return (
    <Card title={`${name} ơi , bạn có thể đăng bài viết ở đây nha !`} size="small">
      <Space
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <MyStatusAreaUploadComponent onPostCreated={onPostCreated}>
          <GoStarFill />
          New Status
        </MyStatusAreaUploadComponent>
        <MyStatusAreaUploadComponent onPostCreated={onPostCreated}>
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
