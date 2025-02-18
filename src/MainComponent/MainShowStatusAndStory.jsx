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
    </Space>
  );
};
