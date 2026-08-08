import { Space } from "antd";
import { MyStatusAreaComponent } from "./MyStatusAreaComponent";
import { FriendStatusListComponent } from "./FriendStatusListComponent";
import { useDispatch } from "react-redux";
import { addListStatus } from "../reduxs/reduxListStatus";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

export const MainShowStatusAndStory = () => {
  const dispatch = useDispatch();

  const handlePostCreated = (payload) => {
    const post = payload?.post ?? payload;

    if (!post || typeof post !== "object") {
      return;
    }

    const token = localStorage.getItem("allow-login");
    const currentUser = decodeJwt(token) ?? {};
    const postUserId = Number(post.user_id ?? currentUser.id);

    dispatch(
      addListStatus({
        ...post,
        user_id: Number.isFinite(postUserId)
          ? postUserId
          : post.user_id,
        user_name: post.user_name ?? currentUser.name,
        name: post.name ?? currentUser.name,
        avatar: post.avatar ?? currentUser.avatar,
      })
    );
  };

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
      {/* <AllStory /> */}

      {/* My status */}
      <MyStatusAreaComponent onPostCreated={handlePostCreated} />

      {/* Friend Status */}
      <FriendStatusListComponent />
    </Space>
  );
};
