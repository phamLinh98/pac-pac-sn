/* eslint-disable react/prop-types */
import { Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { updateUserImageApi } from "../api/restApiConfig";

export const ModalComponent = ({ id, open, hideModal }) => {
  const [form] = useForm(); // Khởi tạo form instance từ Ant Design

  const updateImage = async () => {
    try {
      // Validate form để đảm bảo URL đã được nhập
      const values = await form.validateFields();
      const avatarURL = values.image; // Lấy giá trị URL từ form
      const response = await updateUserImageApi(avatarURL, id);

      if (response.ok) {
        message.success("Cập nhật ảnh thành công!"); // Hiển thị thông báo thành công
        hideModal(); // Đóng modal sau khi cập nhật thành công
        form.resetFields(); // Reset form sau khi cập nhật
      }
    } catch (error) {
      message.error(`Lỗi khi cập nhật ảnh: ${error.message}`); // Hiển thị thông báo lỗi
    }
  };

  return (
    <Modal
      title="Lấy ảnh từ Princest"
      open={open}
      onOk={updateImage} // Gắn hàm updateImage vào sự kiện onOk
      onCancel={() => {
        hideModal();
        form.resetFields(); // Reset form khi cancel
      }}
      okText="Update"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="image"
          label="URL"
          rules={[{ required: true, message: "Please input the image URL!" }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
};