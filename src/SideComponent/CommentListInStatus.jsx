import { useSelector } from "react-redux";
import { Avatar, Button, Input, List, Space } from 'antd';
import { LoadingComponent } from "./LoadingComponent";
import { TbMessageReply } from "react-icons/tb";
import { formatTimeStamp } from "../configs/configTimeStamp";
import { NotListComponent } from "./NoListComponent";
import { useNavigate } from "react-router-dom";
import { ImageStatus } from "./ImageStatus";
import Search from "antd/es/transfer/search";

export const CommentListInDetailComponent = () => {
  const { listComment, loading } = useSelector(state => state.reduxComment);
  const navigate = useNavigate();
  const goToProfileUser = (userId) => {
    navigate(`/profile/${userId}`);
  }

  return (
    <>
    <div
      id="scrollableDiv"
      style={{
        height: 150,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      {loading ? (
        <LoadingComponent />
      ) : listComment.length === 0 ? <div style={{ paddingTop: "2%" }}><NotListComponent description="Bài viết chưa có bình luận" /></div> : (
        <List
          dataSource={listComment}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<ImageStatus image={item.avatar} width='20px'height='20px'
                  active={true}
                  style={{
                    width: '20px', /* Đảm bảo width khớp với kích thước ảnh */
                    height: '20px', /* Đảm bảo height khớp với kích thước ảnh */
                    borderRadius: '5px', /* Giữ border-radius ban đầu */
                    border: '3px solid #0000FF', /* Màu xanh đậm */
                    boxSizing: 'border-box', /* Đảm bảo kích thước không bị ảnh hưởng bởi border */
                    overflow: 'hidden', /* Cắt bỏ phần border thừa nếu có */
                    display: 'flex', /* Để căn giữa nếu cần thiết */
                    alignItems: 'center', /* Căn giữa dọc */
                    justifyContent: 'center', /* Căn giữa ngang */
                  }} />}
                title={<span>
                  <a onClick={() => goToProfileUser(item.user_id)} style={{ textDecoration: 'none', color: 'blue' }}>
                    {item.user_name}
                  </a>
                  <span style={{ fontSize: '0.7rem', color: 'gray' }}>
                    {` (${formatTimeStamp(item.created_at)})`}
                  </span>
                </span>}
                description={<span>{item.content}</span>} />
              <div>Reply <TbMessageReply /></div>
            </List.Item>
          )} />
      )}
    </div>
    <div style={{ paddingTop: "2%" }}>
    <Space.Compact
      style={{
        width: '100%',
      }}
    >
      <Input placeholder="Nhập bình luận" />
      <Button size="large">Bình Luận</Button>
    </Space.Compact>
    </div>
    </>
  );
};
