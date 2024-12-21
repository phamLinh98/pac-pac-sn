import { Button, Image, Modal, Space } from 'antd';
import { useState } from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import { SlLike } from 'react-icons/sl';
import { VscShare } from 'react-icons/vsc';
import { ListComponent } from '../SideComponent/List';
export const FriendStatusButtonModalComponent = () => {
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

  const text = "Bánh trôi nước";
  const maxLength = 100; // Đặt giới hạn ký tự mỗi dòng

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Before Open Modal */}
      <Button onClick={showModal}>
        <FaRegCommentAlt />
        <span>200</span>Comment
      </Button>

      {/* After Open Modal */}
      <Modal
        title={<div style={{ textAlign: 'center', width: '100%' }}>Comment this post</div>}
        open={isModalOpen}
        onOk={handleOk} onCancel={handleCancel}
        footer={null}
      >
        <div>
          <p>
            {isExpanded ? text : `${text.slice(0, maxLength)}...`}{" "}
            <span
              onClick={handleClick}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {isExpanded ? "Ẩn bớt" : " xem tiếp"}{" "}
            </span>
          </p>
        </div>
        <Image
          width={300}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <Space style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end", paddingTop: "10px", paddingBottom: "5px" }}>
          <Button><SlLike /><span>100</span>Like</Button>
          <Button><VscShare /><span>100</span>Share</Button>
        </Space>
        <ListComponent />
      </Modal>
    </>
  );
};
