import { Space, Layout } from "antd";
import { Story } from "../SideComponent/Story";
import { MyStatusAreaComponent } from "./MyStatusAreaComponent";
import { FriendStatusListComponent } from "./FriendStatusListComponent";

export const MainShowStatusAndStory = () => {

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
      <MyStatusAreaComponent />

      {/* Friend Status */}
      <FriendStatusListComponent />

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
