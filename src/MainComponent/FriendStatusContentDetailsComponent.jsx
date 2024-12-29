import { Button, Modal, Space } from 'antd';
import { useRef, useState } from 'react'; // Import useEffect
import { VscShare } from 'react-icons/vsc';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { CommentListInDetailComponent } from '../SideComponent/CommentListInStatus';
import { useDispatch } from 'react-redux';
import { getCommentThunkFunction } from '../reduxs/thunkFunctionComment';
import { RiChatSmileAiLine } from 'react-icons/ri';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { GiChestnutLeaf } from 'react-icons/gi';

export const FriendStatusContentDetailsComponent = ({ comment_count, title, like, shared, image, postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

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
  // Đặt giới hạn ký tự mỗi dòng
  const maxLength = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Before Open Modal */}
      <Button onClick={() => showModal(postId)}>
        <RiChatSmileAiLine />
        <span>{comment_count}</span>Comment
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
            {isExpanded ? title : `${title.slice(0, maxLength)}...`}{' '}
            <span
              onClick={handleClick}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              {isExpanded ? 'Ẩn bớt' : ' xem tiếp'}{' '}
            </span>
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
            {image.map((img, index) => (
              <div
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: "5px", // Để tránh khoảng trống cuối
                  marginBottom: '5px', // Nếu muốn giữ margin dưới các hình ảnh
                  padding: 0, // Bỏ padding nếu có
                }}
              >
                <ImageStatus image={img} width={150} />
              </div>
            ))}
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
          <Button style={{
            color: "green",
            backgroundColor: "white",
            border: "1px solid green"
          }}>
            <GiChestnutLeaf />
            <span>{like}</span>Like
          </Button>
          <Button>
            <VscShare />
            <span>{shared}</span>Share
          </Button>
        </Space>

        <CommentListInDetailComponent />
      </Modal>
    </>
  );
};
