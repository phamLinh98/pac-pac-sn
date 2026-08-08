import { Button, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { CommentListInDetailComponent } from '../SideComponent/CommentListInStatus';
import { useDispatch } from 'react-redux';
import { getCommentThunkFunction } from '../reduxs/thunkFunctionComment';
import { RiChatSmileAiLine } from 'react-icons/ri';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { PostLikeButton } from '../SideComponent/PostLikeButton';
import { PostShareButton } from '../SideComponent/PostShareButton';

// eslint-disable-next-line react/prop-types
export const FriendStatusContentDetailsComponent = ({ likeStatus, comment_count, title, like, shared, image, postId, shareDisabled = false, sharePreview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(Number(comment_count) || 0);
  const dispatch = useDispatch();

  useEffect(() => setCommentCount(Number(comment_count) || 0), [comment_count, postId]);
  useEffect(() => {
    const updateCount = (event) => {
      if (event.detail?.type === 'comment' && Number(event.detail?.postId) === Number(postId)) {
        setCommentCount((current) => current + 1);
      }
    };
    window.addEventListener('post-engagement-updated', updateCount);
    return () => window.removeEventListener('post-engagement-updated', updateCount);
  }, [postId]);

  const showModal = (postId) => {
    setIsModalOpen(true);
    dispatch(getCommentThunkFunction(postId));
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const containerRef = useRef(null);
  return (
    <>
      {/* Before Open Modal */}
      <Button onClick={() => showModal(postId)}>
        <RiChatSmileAiLine />
        <span>{commentCount}</span>Comment
      </Button>

      {/* After Open Modal */}
      <Modal
        title={<div style={{ textAlign: 'center', width: '100%' }}><FaCanadianMapleLeaf /> Bình luận bài viết <FaCanadianMapleLeaf /></div>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {/* Tiêu đề */}
        <div>
          <p>
            {title}
          </p>
        </div>

        {/* Hình ảnh với logic cuộn */}
        <div style={{ position: 'relative', width: '95%', overflowX: 'hidden' }}>
          {/* Container hình ảnh */}
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              gap: '2px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {Array.isArray(image) ? (
              // eslint-disable-next-line react/prop-types
              image.length > 0 ? (
                // eslint-disable-next-line react/prop-types
                image.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-block',
                      marginRight: "5px",
                      marginBottom: '5px',
                      padding: 0,
                    }}
                  >
                    <ImageStatus
                      image={
                        img
                          ? img
                          : 'https://i.pinimg.com/736x/8a/a9/33/8aa933d3cd8b23171598ed577c426f78.jpg'
                      }
                      width={150}
                    />
                  </div>
                ))
              ) : [] // Or [] if you prefer to render nothing
            ) : []}
          </div>
        </div>

        {/* Like/Share */}
        <Space
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '10px',
            paddingBottom: '5px',
          }}
        >
          <PostLikeButton postId={postId} initialCount={like} initialLiked={likeStatus} />
          <PostShareButton postId={postId} initialCount={shared} disabled={shareDisabled} preview={sharePreview} />
        </Space>
        <CommentListInDetailComponent postId={postId} />
      </Modal>
    </>
  );
};
