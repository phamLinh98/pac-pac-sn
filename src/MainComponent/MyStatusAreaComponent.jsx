import { Button, Card, Space } from "antd";
import { BsFillImageFill } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { MyStatusAreaUploadComponent } from "./MyStatusAreaUploadComponent";
import { GoStarFill } from "react-icons/go";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

export const MyStatusAreaComponent = () => {
  const getUserFromLocalStorage = localStorage.getItem('accessToken');
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
        <MyStatusAreaUploadComponent>
          <GoStarFill />
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
