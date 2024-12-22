/* eslint-disable react/prop-types */
import { Button, Flex, Image, Modal } from 'antd';
import { useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
export const MyStatusAreaUploadComponent = ({children}) => {
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

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click(); // Kích hoạt click trên input file
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // Thực hiện upload hoặc xử lý file
    }
  };

  return (
    <>
     {/* Before Open Modal */}

      <Button onClick={showModal}>
          {children}
      </Button>
      
      {/* After Open Modal */}
      <Modal 
        title={<div style={{ textAlign: 'center', width: '100%' }}>Post new status</div>}
        open={isModalOpen}
        onOk={handleOk} onCancel={handleCancel}
        footer={null}
       >
    <TextArea rows={4} style={{ border: 'none', outline: 'none', resize: 'none'}} placeholder='Rin,bạn đang nghĩ gì ?'/>
      <Image
       width={50}
       src="/image.svg"
       style={{paddingBottom:'5px', paddingTop:'5px'}}
       preview={false}
       onClick={handleImageClick}
       />
       <input
        type="file"
        ref={fileInputRef} // Tham chiếu đến input
        style={{ display: "none" }} // Ẩn input
        onChange={handleFileChange} // Xử lý khi file thay đổi
      />
       <Flex vertical gap="small" style={{width: '100%'}}>
        <Button type="primary" block>Post</Button>
       </Flex>
      </Modal>
    </>
  );
};
