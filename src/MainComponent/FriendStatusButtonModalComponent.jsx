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

  const text = "Apollo 7 là chuyến bay có người lái đầu tiên thuộc chương trình không gian Apollo của NASA. Sứ mệnh cũng chứng kiến ​​cơ quan này tiếp tục các chuyến bay đưa con người vào vũ trụ kể từ sau vụ hỏa hoạn khiến ba phi hành gia Apollo 1 thiệt mạng trong cuộc thử nghiệm diễn tập cho phi vụ phóng vào ngày 27 tháng 1 năm 1967. Chỉ huy của phi hành đoàn Apollo 7 là Walter M. Schirra, với Donn F. Eisele làm phi công mô-đun chỉ huy và R. Walter Cunningham đảm nhiệm chức vụ phi công mô-đun Mặt Trăng (ông đã được chỉ định như vậy mặc dù Apollo 7 không mang theo Mô-đun Mặt Trăng). Ba phi hành gia này ban đầu được lựa chọn để tham gia chuyến bay có người lái thứ hai trong chương trình Apollo và sau đó trở thành phi hành đoàn dự phòng cho Apollo 1.";
  const maxLength = 50; // Đặt giới hạn ký tự mỗi dòng

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Button onClick={showModal}>
      <FaRegCommentAlt />
        Comment
      </Button>
      
      {/* After Open Modal */}
      <Modal 
        title="Basic Modal" 
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
      <Space style={{flex: 1,minWidth: 0,display: "flex",justifyContent: "flex-end", paddingTop:"10px", paddingBottom:"5px"}}>
        <Button><SlLike />Like</Button>
        <Button><VscShare />Share</Button>
      </Space>
      <ListComponent/>
      </Modal>
    </>
  );
};
