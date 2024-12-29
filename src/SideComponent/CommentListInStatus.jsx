import { useFacadeComment } from '../reduxs/useFacadeComment';
import { Avatar, List } from 'antd';


export const CommentListInDetailComponent = ({ postIdFromListId }) => {
  const { listComment } = useFacadeComment(postIdFromListId);

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
      <List
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

      {/* <InfiniteScroll
        dataLength={listComment.length}
        //next={loadMoreData}
        hasMore={listComment.length < 20}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      > */}
      {/* </InfiniteScroll> */}
    </div>
  );
};