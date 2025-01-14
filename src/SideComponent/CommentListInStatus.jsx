import { useSelector } from "react-redux";
import { Avatar, List } from 'antd';
import { LoadingComponent } from "./LoadingComponent";
import { TbMessageReply } from "react-icons/tb";
import { formatTimeStamp } from "../configs/configTimeStamp";
import { NotListComponent } from "./NoListComponent";
import { useNavigate } from "react-router-dom";

export const CommentListInDetailComponent = () => {
  const { listComment, loading } = useSelector(state => state.reduxComment);
  const navigate = useNavigate();
  const goToProfileUser = (userId) => {
    navigate(`/profile/${userId}`);
  }

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 200,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      {loading ? (
        <LoadingComponent />
      ) : listComment.length === 0 ? <div style={{ paddingTop: "5%" }}><NotListComponent description="Bài viết chưa có bình luận" /></div> : (
        <List
          dataSource={listComment}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <span>
                    <a  onClick={() => goToProfileUser(item.user_id)} style={{ textDecoration: 'none', color: 'blue' }}>
                      {item.user_name}
                    </a>
                    <span style={{ fontSize: '0.7rem', color: 'gray' }}>
                      {` (${formatTimeStamp(item.created_at)})`}
                    </span>
                  </span>
                }
                description={<span>{item.content}</span>}
              />
              <div>Reply <TbMessageReply /></div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
