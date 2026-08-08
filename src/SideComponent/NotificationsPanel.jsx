import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Button, Empty, List, Popover, Spin, message } from 'antd';
import { GrNotification } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import {
    getCommentNotificationsApi,
    markAllCommentNotificationsAsReadApi,
    markNotificationAsReadApi,
} from '../api/restApiConfig';

const formatNotificationTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
};

const NotificationsPanel = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        try {
            const result = await getCommentNotificationsApi();
            setNotifications(Array.isArray(result) ? result : []);
        } catch (error) {
            if (!silent) message.error(error.message || 'Không thể tải thông báo');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const refresh = () => fetchNotifications({ silent: true });
        const intervalId = window.setInterval(refresh, 30000);
        window.addEventListener('focus', refresh);
        window.addEventListener('comment-notification-updated', refresh);
        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('focus', refresh);
            window.removeEventListener('comment-notification-updated', refresh);
        };
    }, [fetchNotifications]);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.is_read).length,
        [notifications]
    );

    const openNotification = async (notification) => {
        if (!notification.is_read) {
            try {
                await markNotificationAsReadApi(notification.id);
                setNotifications((current) => current.map((item) =>
                    item.id === notification.id ? { ...item, is_read: true } : item
                ));
            } catch (error) {
                message.error(error.message || 'Không thể cập nhật thông báo');
                return;
            }
        }
        setOpen(false);
        navigate(`/profile/${notification.receiver_user_id}`, {
            state: { highlightedPostId: notification.post_id },
        });
    };

    const markAllAsRead = async () => {
        try {
            await markAllCommentNotificationsAsReadApi();
            setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
        } catch (error) {
            message.error(error.message || 'Không thể cập nhật thông báo');
        }
    };

    const popoverContent = (
        <div style={{ width: 360, maxWidth: '82vw' }}>
            {loading ? (
                <div style={{ padding: 32, textAlign: 'center' }}><Spin /></div>
            ) : notifications.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có thông báo" />
            ) : (
                <List
                    style={{ maxHeight: 420, overflowY: 'auto' }}
                    itemLayout="horizontal"
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => openNotification(item)}
                            style={{
                                cursor: 'pointer',
                                paddingInline: 8,
                                background: item.is_read ? 'transparent' : 'rgba(22, 119, 255, 0.08)',
                            }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.sender_avatar}>{item.sender_name?.[0]}</Avatar>}
                                title={<span><strong>{item.sender_name || 'Người dùng'}</strong> {item.notification_type === 'LIKE' ? 'đã thích bài viết của bạn' : item.notification_type === 'SHARE' ? 'đã chia sẻ bài viết của bạn' : 'đã bình luận bài viết của bạn'}</span>}
                                description={
                                    <div>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.notification_type === 'LIKE' ? 'Lượt thích mới' : item.notification_type === 'SHARE' ? 'Lượt chia sẻ mới' : (item.comment_content || 'Bình luận mới')}
                                        </div>
                                        <small>{formatNotificationTime(item.created_at)}</small>
                                    </div>
                                }
                            />
                            {!item.is_read && <Badge status="processing" />}
                        </List.Item>
                    )}
                />
            )}
            {unreadCount > 0 && (
                <Button type="link" block onClick={markAllAsRead} style={{ marginTop: 8 }}>
                    Đánh dấu tất cả đã đọc
                </Button>
            )}
        </div>
    );

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Popover
                content={popoverContent}
                title="Thông báo"
                placement="bottom"
                trigger="click"
                open={open}
                onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);
                    if (nextOpen) fetchNotifications();
                }}
            >
                <div style={{ cursor: 'pointer' }}>
                    <Badge count={unreadCount} size="small" overflowCount={99}>
                        <GrNotification style={{ fontSize: 17, color: 'white' }} />
                    </Badge>
                </div>
            </Popover>
        </div>
    );
};

export default NotificationsPanel;
