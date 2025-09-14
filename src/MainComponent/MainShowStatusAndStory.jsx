import { Space } from "antd";
import { MyStatusAreaComponent } from "./MyStatusAreaComponent";
import { FriendStatusListComponent } from "./FriendStatusListComponent";
import { AllStory } from "../SideComponent/Story";

export const MainShowStatusAndStory = () => {
  // const [collapsed, setCollapsed] = useState(false);
  return (
    <Space
      direction="vertical"
      size="small"
      style={{
        display: "flex",
        marginTop: "5px"
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
