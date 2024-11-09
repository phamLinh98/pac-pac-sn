import { Space, Layout } from "antd";
import { Story } from "../SideComponent/Story";
import { MyStatusComponent } from "./MyStatusComponent";
import { FriendStatusComponent } from "./FriendStatusComponent";

export const BodyMainComponent = () => {

  return (
    <Space
      direction="vertical"
      size="small"
      style={{
        display: "flex",
      }}
    >
      {/* Story of friends */}
      <Story />
      
      {/* My status */}
       <MyStatusComponent/>

      {/* Friend Status */}
      <FriendStatusComponent/>

      {/* Footer */}
      <Layout.Footer
        style={{
          textAlign: "center",
          marginTop: 20, // Add margin for spacing
        }}
      >
        Linhthusinh ©{new Date().getFullYear()} donate để mình thuê Server ngon hơn nhé ?
      </Layout.Footer>
    </Space>
  );
};
