/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Button, Image, Input, List, Space, message, } from 'antd';
import { LoadingComponent } from "./LoadingComponent";
import { TbMessageReply } from "react-icons/tb";
import { IoImageOutline, IoCloseCircle } from "react-icons/io5";
import { formatTimeStamp } from "../configs/configTimeStamp";
import { NotListComponent } from "./NoListComponent";
import { useNavigate } from "react-router-dom";
import { ImageStatus } from "./ImageStatus";
import { useEffect, useRef, useState } from "react";
import { addCommentThunkFunction } from "../reduxs/thunkFunctionComment";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { EmojiPopover } from "./Popover";
import { useFacadeComment } from "../reduxs/useFacadeComment";


// Main Component
export const CommentListInDetailComponent = ({ postId }) => {
  //const { listComment, loading } = useSelector(state => state.reduxComment);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState('');
  const imageInputRef = useRef(null);
  const { listComment, loading } = useFacadeComment(postId);

  useEffect(() => () => {
    if (commentImagePreview) URL.revokeObjectURL(commentImagePreview);
  }, [commentImagePreview]);


  // Lấy thông tin user từ localStorage
  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const userData = decodeJwt(getUserFromLocalStorage);
  const { id: userId } = userData;

  const goToProfileUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() && !commentImage) {
      message.warning('Vui lòng nhập nội dung hoặc chọn ảnh');
      return;
    }

    if (!postId || !userId) {
      message.error('Thiếu thông tin cần thiết để thêm bình luận');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(addCommentThunkFunction(commentText, userId, postId, commentImage));
      setCommentText('');
      setCommentImage(null);
      setCommentImagePreview('');
      message.success('Bình luận đã được thêm');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Có lỗi xảy ra khi thêm bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      message.warning('Chỉ hỗ trợ ảnh JPEG, PNG, WEBP hoặc GIF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.warning('Ảnh bình luận không được vượt quá 5 MB');
      return;
    }
    setCommentImage(file);
    setCommentImagePreview(URL.createObjectURL(file));
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
                  description={
                    <div>
                      {item.content && <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.content}</div>}
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt="Ảnh bình luận"
                          style={{ marginTop: item.content ? 6 : 0, maxWidth: 220, maxHeight: 220, objectFit: 'contain', borderRadius: 8 }}
                        />
                      )}
                    </div>
                  }
                />
                <div>Reply <TbMessageReply /></div>
              </List.Item>
            )}
          />
        )}
      </div>
      <div style={{ paddingTop: "2%" }}>
        {commentImagePreview && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
            <Image src={commentImagePreview} alt="Ảnh chuẩn bị bình luận" width={72} height={72} preview={false} style={{ objectFit: 'cover', borderRadius: 8 }} />
            <Button
              type="text"
              shape="circle"
              size="small"
              aria-label="Bỏ ảnh"
              icon={<IoCloseCircle />}
              onClick={() => { setCommentImage(null); setCommentImagePreview(''); }}
              style={{ position: 'absolute', top: -10, right: -10, background: '#fff' }}
            />
          </div>
        )}
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
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} style={{ display: 'none' }} />
          <Button
            size="large"
            aria-label="Thêm ảnh bình luận"
            icon={<IoImageOutline />}
            onClick={() => imageInputRef.current?.click()}
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
            disabled={(!commentText.trim() && !commentImage) || isSubmitting}
          >
            Bình Luận
          </Button>
        </Space.Compact>
      </div>
    </>
  );
};
