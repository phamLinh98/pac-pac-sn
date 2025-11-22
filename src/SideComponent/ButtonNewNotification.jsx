import { useState, useEffect } from 'react';
import { IoMdPersonAdd } from 'react-icons/io';
import { Popover, Modal, Button, Avatar } from 'antd';
import { getApi } from '../api/restApiConfig';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]); // Lưu trữ danh sách thông báo từ API
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  // Đảm bảo notifications luôn là array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const numberAdd = safeNotifications.length; // Số lượng thông báo từ API

  const getUserFromLocalStorage = localStorage.getItem("allow-login");
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id } = getData;

  const idToNumber = +id;
  // Hàm lấy danh sách yêu cầu kết bạn
  const fetchFriendRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getApi(`/send-friend/${idToNumber}`);
      const response = await data.json();
      setNotifications(response); // Giả định API trả về mảng thông báo
    } catch (error) {
      console.error('Lỗi khi lấy yêu cầu kết bạn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchFriendRequests();
  }, [idToNumber]); // Gọi lại API nếu idToNumber thay đổi

  // Hàm để hiển thị Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm để đóng Modal và làm mới dữ liệu
  const handleOk = () => {
    fetchFriendRequests(); // Làm mới danh sách thông báo
    setIsModalVisible(false); // Đóng Modal
  };

  // Hàm để đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Nội dung của Popover với bố cục Flex
  const popoverContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p>Bạn có {numberAdd} yêu cầu kết bạn mới</p>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : safeNotifications.length === 0 ? (
        <div style={{textAlign:"center"}}>Danh sách trống</div>
      ) : (
        safeNotifications.map((notification) => (
          <div key={notification.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Dòng 1: Ảnh và Tên */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar src={notification.avatar} size={32} />
              <span>{notification.name_sending}(20 bạn chung)</span>
            </div>
            {/* Dòng 2: Button Đồng ý và Từ chối */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="primary"
                size="small"
                //onClick={() => handleAccept(notification.id)}
              >
                Đồng ý
              </Button>
              <Button
                size="small"
                //onClick={() => handleReject(notification.id)}
              >
                Từ chối
              </Button>
            </div>
          </div>
        ))
      )}
      <Button type="primary" onClick={showModal} style={{ marginTop: '8px' }}>
        Xem chi tiết
      </Button>
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Popover
        content={popoverContent}
        title="Thông báo"
        placement="bottom"
        trigger="click"
      >
        <div style={{ cursor: 'pointer' }}>
          <IoMdPersonAdd style={{ fontSize: '17px' }} />
        { safeNotifications.length ?
          <span
            style={{
              position: 'absolute',
              top: '10px',
              right: '-8px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '100%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 'bold',
            }}
          >
           {notifications.length ? (numberAdd > 99 ? '99+' : numberAdd) : 0}
          </span>
          : null
        }
        </div>
      </Popover>

      {/* Modal hiển thị khi click vào nút trong Popover */}
      <Modal
        title="Chi tiết thông báo"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <p>Đây là nội dung chi tiết của thông báo.</p>
       { safeNotifications.length ? <p>Bạn có {numberAdd} lời mời kết bạn mới.</p> : '' }
        {safeNotifications.map((notif) => (
          <div key={notif.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Avatar src={notif.avatar} size={32} />
            <span>{notif.name}</span>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default NotificationIcon;