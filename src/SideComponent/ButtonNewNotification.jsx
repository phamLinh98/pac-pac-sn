import { useCallback, useState, useEffect } from 'react';
import { IoMdPersonAdd } from 'react-icons/io';
import { Popover, Modal, Button, Avatar, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getFriendRequestsApi, sendFriendRequestApi } from '../api/restApiConfig';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';

const normalizeFriendRequestList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.result)) {
    return response.result;
  }

  if (response?.result && typeof response.result === "object") {
    return [response.result];
  }

  return [];
};

const NotificationIcon = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // Lưu trữ danh sách thông báo từ API
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  // Đảm bảo notifications luôn là array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const numberAdd = safeNotifications.filter((notification) => {
    const status = String(notification?.status || '').toLowerCase();
    return status === 'pending' || status === 'waiting' || status === '';
  }).length;

  const getUserFromLocalStorage = localStorage.getItem("allow-login");
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id } = getData;

  const idToNumber = Number(id);

  const getNotificationName = (notification) => {
    return (
      notification?.sender_name ||
      notification?.name_sending ||
      notification?.name ||
      notification?.senderName ||
      notification?.user_name ||
      notification?.sender_name ||
      'Người dùng'
    );
  };

  const getNotificationAvatar = (notification) => {
    return notification?.sender_avatar || notification?.avatar;
  };

  const getNotificationSenderId = (notification) => {
    const candidates = [
      notification?.userIdFirst,
      notification?.user_id_first,
      notification?.senderId,
      notification?.sender_id,
      notification?.fromUserId,
      notification?.from_user_id,
      notification?.userId,
      notification?.user_id,
    ];

    for (const candidate of candidates) {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  };

  const moveToProfile = (notification) => {
    const senderId = getNotificationSenderId(notification);

    if (!Number.isFinite(senderId)) {
      message.error('Không thể xác định người gửi lời mời kết bạn.');
      return;
    }

    navigate(`/profile/${senderId}`);
  };

  // Hàm lấy danh sách yêu cầu kết bạn
  const fetchFriendRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFriendRequestsApi(idToNumber);
      const response = await data.json().catch(() => null);
      const normalizedNotifications = normalizeFriendRequestList(response).filter((notification) => {
        const status = String(notification?.status || '').toLowerCase();
        const receiverId = Number(notification?.receiver_id);
        return receiverId === idToNumber && (
          status === 'pending' ||
          status === 'wait' ||
          status === 'waiting' ||
          status === ''
        );
      });
      setNotifications(normalizedNotifications);
    } catch (error) {
      console.error('Lỗi khi lấy yêu cầu kết bạn:', error);
    } finally {
      setIsLoading(false);
    }
  }, [idToNumber]);

  // useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  // Hàm để hiển thị Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAcceptRequest = async (notification) => {
    const senderId = getNotificationSenderId(notification);

    if (!Number.isFinite(idToNumber) || idToNumber <= 0 || !Number.isFinite(senderId)) {
      message.error('Không thể xác định người gửi lời mời kết bạn.');
      return;
    }

    try {
      const response = await sendFriendRequestApi(idToNumber, senderId);
      const payload = await response.json().catch(() => null);
      const result = Array.isArray(payload?.result)
        ? payload.result[0]
        : payload?.result;

      if (String(result?.status || '').toLowerCase() !== 'accepted') {
        throw new Error('Server chưa xác nhận lời mời kết bạn.');
      }
      window.dispatchEvent(new Event('friend-request-updated'));
      message.success('Đã chấp nhận lời mời kết bạn.');
      await fetchFriendRequests();
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Không thể chấp nhận lời mời kết bạn.'
      );
    }
  };

  const handleRejectRequest = (notificationId) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== notificationId)
    );
    message.info('Đã bỏ qua lời mời kết bạn.');
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
              <Avatar src={getNotificationAvatar(notification)} size={32} />
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  moveToProfile(notification);
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {getNotificationName(notification)} đã gửi lời mời kết bạn
              </span>
            </div>
            {/* Dòng 2: Button Đồng ý và Từ chối */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="primary"
                size="small"
                onClick={() => handleAcceptRequest(notification)}
              >
                Đồng ý
              </Button>
              <Button
                size="small"
                onClick={() => handleRejectRequest(notification.id)}
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
            <Avatar src={getNotificationAvatar(notif)} size={32} />
            <span
              onClick={() => moveToProfile(notif)}
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              {getNotificationName(notif)}
            </span>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default NotificationIcon;
