/* eslint-disable react/prop-types */
import { Button, Flex, Image, Modal } from 'antd';
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
export const MyStatusButtonModalComponent = ({children}) => {
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
       />
       <Flex vertical gap="small" style={{width: '100%'}}>
        <Button type="primary" block>Post</Button>
       </Flex>
      </Modal>
    </>
  );
};
