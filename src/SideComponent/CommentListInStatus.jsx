/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, List, Space, message, } from 'antd';
import { LoadingComponent } from "./LoadingComponent";
import { TbMessageReply } from "react-icons/tb";
import { formatTimeStamp } from "../configs/configTimeStamp";
import { NotListComponent } from "./NoListComponent";
import { useNavigate } from "react-router-dom";
import { ImageStatus } from "./ImageStatus";
import { useState } from "react";
//import { addCommentThunkFunction } from "../reduxs/thunkFunctionComment";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { EmojiPopover } from "./Popover";
import { useFacadeComment } from "../reduxs/useFacadeComment";


// Main Component
export const CommentListInDetailComponent = ({ postId }) => {
  //const { listComment, loading } = useSelector(state => state.reduxComment);
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { listComment, loading } = useFacadeComment(postId);


  // Lấy thông tin user từ localStorage
  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const userData = decodeJwt(getUserFromLocalStorage);
  const { id: userId } = userData;

  const goToProfileUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!postId || !userId) {
      message.error('Thiếu thông tin cần thiết để thêm bình luận');
      return;
    }

    setIsSubmitting(true);

    try {
      //await dispatch(addCommentThunkFunction(commentText, userId, postId));
      setCommentText(''); // Reset input sau khi thêm thành công
      message.success('Bình luận đã được thêm');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Có lỗi xảy ra khi thêm bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        ) : listComment.length === 0 ? (
          <div style={{ paddingTop: "2%" }}>
            <NotListComponent description="Bài viết chưa có bình luận" />
          </div>
        ) : (
          <List
            dataSource={listComment}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <ImageStatus
                      image={item.avatar}
                      width='20px'
                      height='20px'
                      active={true}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: '3px solid #0000FF',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  }
                  title={
                    <span>
                      <a
                        onClick={() => goToProfileUser(item.user_id)}
                        style={{ textDecoration: 'none', color: 'blue' }}
                      >
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
      <div style={{ paddingTop: "2%" }}>
        <Space.Compact
          style={{
            width: '100%',
          }}
        >
          <Input
            placeholder="Nhập bình luận"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPressEnter={handleAddComment}
            disabled={isSubmitting}
          />
          <EmojiPopover
            handleAddComment={handleAddComment}
            isSubmitting={isSubmitting}
            setCommentText={setCommentText}
            commentText={commentText}
          />
          <Button
            size="large"
            onClick={handleAddComment}
            loading={isSubmitting}
            disabled={!commentText.trim() || isSubmitting}
          >
            Bình Luận
          </Button>
        </Space.Compact>
      </div>
    </>
  );
};
