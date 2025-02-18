import { Space, Layout } from "antd";
import { MyStatusAreaComponent } from "./MyStatusAreaComponent";
import { FriendStatusListComponent } from "./FriendStatusListComponent";
import { AllStory } from "../SideComponent/Story";
import { useState } from "react";

export const MainShowStatusAndStory = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Space
      direction="vertical"
      size="small"
      style={{
        display: "flex",
      }}
    >
      {/* Story of friends */}
      <AllStory />

      {/* My status */}
      <MyStatusAreaComponent />

      {/* Friend Status */}
      <FriendStatusListComponent />

      {/* Footer */}
      <Layout.Footer
        style={{
          textAlign: "center",
          paddingTop:'20',
          position: "fixed",      // Fix the footer's position          // Stick it to the bottom
          backgroundColor: 'white', // Or whatever background you want
          zIndex: 1, // Ensure it's above the content
        }}
      >
        Raccoon ©{new Date().getFullYear()}
      </Layout.Footer>
    </Space>
  );
};
