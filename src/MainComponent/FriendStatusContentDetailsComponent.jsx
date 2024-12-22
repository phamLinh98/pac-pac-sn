import { Button, Modal, Space, Card } from 'antd';
import { useRef, useState } from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import { SlLike } from 'react-icons/sl';
import { VscShare } from 'react-icons/vsc';
import { ImageStatus } from '../SideComponent/ImageStatus';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { CommentListInDetailComponent } from '../SideComponent/CommentListInStatus';

export const FriendStatusButtonModalComponent = ({ comment_count, title, like, shared, image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const containerRef = useRef(null);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200; // Cuộn sang trái
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200; // Cuộn sang phải
    }
  };

  // Đặt giới hạn ký tự mỗi dòng
  const maxLength = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Before Open Modal */}
      <Button onClick={showModal}>
        <FaRegCommentAlt />
        <span>{comment_count}</span>Comment
      </Button>

      {/* After Open Modal */}
      <Modal
        title={<div style={{ textAlign: 'center', width: '100%' }}>Comment this post</div>}
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
          {/* Nút cuộn trái */}
          <button
            onClick={handleScrollLeft}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              zIndex: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            <TiChevronLeft />
          </button>

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

          {/* Nút cuộn phải */}
          <button
            onClick={handleScrollRight}
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              zIndex: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            <TiChevronRight />
          </button>
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
          <Button>
            <SlLike />
            <span>{like}</span>Like
          </Button>
          <Button>
            <VscShare />
            <span>{shared}</span>Share
          </Button>
        </Space>

        {/* List Component each Status of User */}
        <CommentListInDetailComponent />
      </Modal>
    </>
  );
};
