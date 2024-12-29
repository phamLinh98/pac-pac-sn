import { useSelector } from "react-redux";
import { Avatar, List } from 'antd';

export const CommentListInDetailComponent = () => {
  const { listComment, loading } = useSelector(state => state.reduxComment);

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
      {
        loading && <div>loading...</div>
      }
      {
        !loading && <List
          dataSource={listComment}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="https://ant.design">{item.user_name}</a>}
                description={item.content}
              />
              <div>Content</div>
            </List.Item>
          )}
        />
      }
    </div>
  );
};