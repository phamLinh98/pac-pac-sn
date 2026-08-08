import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar, Badge, Button, Empty, Image, Input, List, Modal, Popover, Segmented,
  Select, Space, Spin, Typography, message,
} from 'antd';
import { SiMessenger } from 'react-icons/si';
import { IoArrowBack, IoImageOutline, IoPeopleOutline, IoPersonAddOutline, IoSend } from 'react-icons/io5';
import { decodeJwt } from '../SideFunction/VerifyJwtGetUserInfo';
import {
  addChatMembersApi, createDirectChatApi, createGroupChatApi, getChatMessagesApi,
  getChatsApi, getFriendsApi, leaveChatGroupApi, markChatReadApi, sendChatImageApi, sendChatMessageApi,
} from '../api/restApiConfig';

const { Text } = Typography;

const shortTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit',
  }).format(date);
};

const ChatHistoryPanel = () => {
  const user = decodeJwt(localStorage.getItem('allow-login')) || {};
  const currentUserId = Number(user.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState('DIRECT');
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [memberOpen, setMemberOpen] = useState(false);
  const [newMemberIds, setNewMemberIds] = useState([]);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches);
  const messageEndRef = useRef(null);
  const imageInputRef = useRef(null);

  const selectedChat = chats.find((chat) => Number(chat.id) === Number(selectedChatId));
  const totalUnread = useMemo(() => chats.reduce((sum, chat) => sum + Number(chat.unread_count || 0), 0), [chats]);

  const loadChats = useCallback(async (silent = false) => {
    if (!silent) setLoadingChats(true);
    try {
      const result = await getChatsApi();
      setChats(Array.isArray(result) ? result : []);
    } catch (error) {
      if (!silent) message.error(error.message || 'Không thể tải chat');
    } finally {
      if (!silent) setLoadingChats(false);
    }
  }, []);

  const loadFriends = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const result = await getFriendsApi(currentUserId);
      setFriends(Array.isArray(result) ? result : []);
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách bạn bè');
    }
  }, [currentUserId]);

  const loadMessages = useCallback(async (chatId, silent = false) => {
    if (!chatId) return;
    if (!silent) setLoadingMessages(true);
    try {
      const result = await getChatMessagesApi(chatId);
      const normalized = Array.isArray(result) ? result : [];
      setMessages(normalized);
      const last = normalized.at(-1);
      if (last) {
        await markChatReadApi(chatId, last.id).catch(() => undefined);
        setChats((current) => current.map((chat) => Number(chat.id) === Number(chatId)
          ? { ...chat, unread_count: 0 } : chat));
      }
    } catch (error) {
      if (!silent) message.error(error.message || 'Không thể tải tin nhắn');
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 700px)');
    const handleChange = (event) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  useEffect(() => {
    loadChats();
    const notificationTimer = window.setInterval(() => loadChats(true), 5000);
    const refreshOnFocus = () => loadChats(true);
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      window.clearInterval(notificationTimer);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [loadChats]);
  useEffect(() => {
    if (!modalOpen) return undefined;
    loadFriends();
    return undefined;
  }, [modalOpen, loadFriends]);
  useEffect(() => {
    if (!modalOpen || !selectedChatId) return undefined;
    loadMessages(selectedChatId);
    const messageTimer = window.setInterval(() => loadMessages(selectedChatId, true), 3000);
    return () => window.clearInterval(messageTimer);
  }, [modalOpen, selectedChatId, loadMessages]);
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const openChat = (chatId) => {
    setSelectedChatId(Number(chatId));
    setModalOpen(true);
    setPopoverOpen(false);
  };

  useEffect(() => {
    const openDirectChat = async (event) => {
      const otherUserId = Number(event.detail?.userId);
      if (!Number.isInteger(otherUserId) || otherUserId <= 0 || otherUserId === currentUserId) return;
      try {
        const created = await createDirectChatApi(otherUserId);
        await loadChats(true);
        openChat(created.id);
      } catch (error) {
        message.error(error.message || 'Không thể mở cuộc trò chuyện');
      }
    };
    window.addEventListener('open-direct-chat', openDirectChat);
    return () => window.removeEventListener('open-direct-chat', openDirectChat);
  }, [currentUserId, loadChats]);

  const sendMessage = async () => {
    const content = draft.trim();
    if (!content || !selectedChatId || sending) return;
    setSending(true);
    try {
      const created = await sendChatMessageApi(selectedChatId, content);
      setMessages((current) => [...current.filter((item) => item.id !== created.id), created]);
      setDraft('');
      await loadChats(true);
    } catch (error) {
      message.error(error.message || 'Không thể gửi tin nhắn');
    } finally { setSending(false); }
  };

  const sendImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedChatId || uploadingImage) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      return message.warning('Chỉ hỗ trợ ảnh JPEG, PNG, WEBP hoặc GIF');
    }
    if (file.size > 5 * 1024 * 1024) return message.warning('Ảnh không được vượt quá 5 MB');
    setUploadingImage(true);
    try {
      const created = await sendChatImageApi(selectedChatId, file);
      setMessages((current) => [...current.filter((item) => item.id !== created.id), created]);
      await loadChats(true);
    } catch (error) {
      message.error(error.message || 'Không thể gửi ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  const createChat = async () => {
    try {
      let created;
      if (createType === 'DIRECT') {
        if (selectedFriendIds.length !== 1) return message.warning('Chọn một người để nhắn tin');
        created = await createDirectChatApi(selectedFriendIds[0]);
      } else {
        if (!groupName.trim()) return message.warning('Nhập tên nhóm');
        if (!selectedFriendIds.length) return message.warning('Chọn ít nhất một thành viên');
        created = await createGroupChatApi(groupName.trim(), selectedFriendIds);
      }
      setCreateOpen(false); setSelectedFriendIds([]); setGroupName('');
      await loadChats();
      openChat(created.id);
    } catch (error) { message.error(error.message || 'Không thể tạo cuộc trò chuyện'); }
  };

  const addMembers = async () => {
    try {
      await addChatMembersApi(selectedChatId, newMemberIds);
      setMemberOpen(false); setNewMemberIds([]); await loadChats();
      message.success('Đã thêm thành viên');
    } catch (error) { message.error(error.message || 'Không thể thêm thành viên'); }
  };

  const leaveGroup = () => Modal.confirm({
    title: 'Rời nhóm chat?', content: 'Bạn sẽ không còn xem hoặc gửi tin nhắn trong nhóm.',
    okText: 'Rời nhóm', okButtonProps: { danger: true }, cancelText: 'Hủy',
    onOk: async () => {
      try {
        await leaveChatGroupApi(selectedChatId); setSelectedChatId(null); setMessages([]); await loadChats();
      } catch (error) { message.error(error.message || 'Không thể rời nhóm'); }
    },
  });

  const memberOptions = friends.map((friend) => ({ value: Number(friend.id), label: friend.name }));
  const addableMemberOptions = memberOptions.filter((option) =>
    !selectedChat?.members?.some((member) => Number(member.user_id) === option.value));
  const canManageMembers = selectedChat?.chat_type === 'GROUP' && ['OWNER', 'ADMIN'].includes(selectedChat.member_role);

  const chatList = (compact = false) => (
    <List
      loading={loadingChats && !compact}
      dataSource={compact ? chats.slice(0, 6) : chats}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có cuộc trò chuyện" /> }}
      renderItem={(chat) => (
        <List.Item onClick={() => openChat(chat.id)} style={{ cursor: 'pointer', paddingInline: 10,
          background: !compact && Number(chat.id) === Number(selectedChatId) ? 'rgba(22,119,255,.1)' : undefined }}>
          <List.Item.Meta avatar={<Badge count={chat.unread_count} size="small"><Avatar src={chat.display_avatar}>{chat.chat_type === 'GROUP' ? <IoPeopleOutline /> : chat.display_name?.[0]}</Avatar></Badge>}
            title={<Text strong ellipsis>{chat.display_name}</Text>}
            description={<Text type="secondary" ellipsis>{chat.last_message_type === 'IMAGE' ? '📷 Hình ảnh' : (chat.last_message || 'Bắt đầu trò chuyện')}</Text>} />
          {!compact && <Text type="secondary" style={{ fontSize: 11 }}>{shortTime(chat.last_message_at)}</Text>}
        </List.Item>
      )}
    />
  );

  return <div style={{ position: 'relative', display: 'inline-block' }}>
    <Popover open={popoverOpen} onOpenChange={(open) => { setPopoverOpen(open); if (open) loadChats(); }} trigger="click" placement="bottom"
      title="Tin nhắn" content={<div style={{ width: 340, maxWidth: '80vw' }}>{chatList(true)}<Button block type="primary" onClick={() => setModalOpen(true)}>Mở Messenger</Button></div>}>
      <Badge count={totalUnread} size="small" overflowCount={99}><SiMessenger style={{ fontSize: 17, color: 'white', cursor: 'pointer' }} /></Badge>
    </Popover>

    <Modal
      title={isMobile && selectedChat ? null : 'Messenger'}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={null}
      width={isMobile ? '100vw' : 920}
      style={isMobile ? { top: 0, margin: 0, paddingBottom: 0, maxWidth: '100vw' } : undefined}
      styles={{
        content: isMobile ? { height: '100dvh', borderRadius: 0, padding: 0 } : undefined,
        header: isMobile ? { padding: '14px 16px', margin: 0 } : undefined,
        body: { padding: 0 },
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(220px, 32%) 1fr', height: isMobile ? (selectedChat ? '100dvh' : 'calc(100dvh - 54px)') : '65vh', minHeight: isMobile ? 0 : 480 }}>
        <div style={{ borderRight: isMobile ? 0 : '1px solid #eee', overflowY: 'auto', display: isMobile && selectedChat ? 'none' : 'block' }}>
          <Button type="text" block icon={<IoPersonAddOutline />} onClick={() => setCreateOpen(true)}>Cuộc trò chuyện mới</Button>
          {chatList(false)}
        </div>
        {!selectedChat ? (!isMobile && <Empty style={{ margin: 'auto' }} description="Chọn một cuộc trò chuyện" />) :
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 8, minHeight: 54 }}>
              {isMobile && <Button type="text" shape="circle" aria-label="Quay lại danh sách chat" icon={<IoArrowBack />} onClick={() => { setSelectedChatId(null); setMessages([]); }} />}
              <Avatar src={selectedChat.display_avatar}>{selectedChat.display_name?.[0]}</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}><Text strong ellipsis style={{ display: 'block' }}>{selectedChat.display_name}</Text>{selectedChat.chat_type === 'GROUP' && <Text type="secondary" style={{ fontSize: 11 }}>{selectedChat.members?.length || 0} thành viên</Text>}</div>
              {canManageMembers && <Button size="small" onClick={() => setMemberOpen(true)}>{isMobile ? '+' : 'Thêm người'}</Button>}
              {selectedChat.chat_type === 'GROUP' && <Button size="small" danger onClick={leaveGroup}>{isMobile ? 'Rời' : 'Rời nhóm'}</Button>}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f5f7fb' }}>
              {loadingMessages ? <div style={{ textAlign: 'center' }}><Spin /></div> : messages.length === 0 ? <Empty description="Chưa có tin nhắn" /> :
                messages.map((item) => {
                  const mine = Number(item.sender_id) === currentUserId;
                  return <div key={item.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', gap: 7, marginBottom: 10 }}>
                    {!mine && <Avatar size={28} src={item.sender_avatar}>{item.sender_name?.[0]}</Avatar>}
                    <div style={{ maxWidth: '72%' }}>{!mine && selectedChat.chat_type === 'GROUP' && <div style={{ fontSize: 11, color: '#777' }}>{item.sender_name}</div>}
                      {item.is_deleted ? (
                        <div style={{ padding: '8px 12px', borderRadius: 16, background: mine ? '#1677ff' : '#fff', color: mine ? '#fff' : '#111' }}>Tin nhắn đã bị xóa</div>
                      ) : item.message_type === 'IMAGE' ? (
                        <div style={{ padding: 4, borderRadius: 14, background: mine ? '#1677ff' : '#fff' }}>
                          <Image src={item.media_url} alt="Ảnh trong cuộc trò chuyện" style={{ display: 'block', maxWidth: isMobile ? 220 : 320, maxHeight: 360, objectFit: 'contain', borderRadius: 10 }} />
                          {item.message && <div style={{ padding: '6px 8px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: mine ? '#fff' : '#111' }}>{item.message}</div>}
                        </div>
                      ) : (
                        <div style={{ padding: '8px 12px', borderRadius: 16, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: mine ? '#1677ff' : '#fff', color: mine ? '#fff' : '#111' }}>{item.message}</div>
                      )}
                      <div style={{ fontSize: 10, color: '#888', textAlign: mine ? 'right' : 'left' }}>{shortTime(item.created_at)}</div>
                    </div>
                  </div>;
                })}
              <div ref={messageEndRef} />
            </div>
            <Space.Compact style={{ padding: isMobile ? 8 : 12, paddingBottom: isMobile ? 'max(8px, env(safe-area-inset-bottom))' : 12, width: '100%' }}>
              <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={sendImage} style={{ display: 'none' }} />
              <Button aria-label="Gửi ảnh" icon={<IoImageOutline />} loading={uploadingImage} disabled={sending} onClick={() => imageInputRef.current?.click()} />
              <Input value={draft} maxLength={5000} placeholder="Nhập tin nhắn..." onChange={(event) => setDraft(event.target.value)} onPressEnter={(event) => { if (!event.shiftKey) sendMessage(); }} />
              <Button type="primary" icon={<IoSend />} loading={sending} disabled={!draft.trim()} onClick={sendMessage}>Gửi</Button>
            </Space.Compact>
          </div>}
      </div>
    </Modal>

    <Modal title="Tạo cuộc trò chuyện" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={createChat} okText="Tạo" cancelText="Hủy" width={isMobile ? 'calc(100vw - 24px)' : 520}>
      <Segmented block value={createType} onChange={(value) => { setCreateType(value); setSelectedFriendIds([]); }} options={[{ label: 'Chat 1-1', value: 'DIRECT' }, { label: 'Nhóm', value: 'GROUP' }]} />
      {createType === 'GROUP' && <Input style={{ marginTop: 16 }} maxLength={255} value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Tên nhóm" />}
      <Select style={{ width: '100%', marginTop: 16 }} mode={createType === 'GROUP' ? 'multiple' : undefined} value={createType === 'GROUP' ? selectedFriendIds : selectedFriendIds[0]} options={memberOptions} placeholder="Chọn bạn bè" onChange={(value) => setSelectedFriendIds(Array.isArray(value) ? value : [value])} />
    </Modal>

    <Modal title="Thêm thành viên" open={memberOpen} onCancel={() => setMemberOpen(false)} onOk={addMembers} okButtonProps={{ disabled: !newMemberIds.length }} okText="Thêm" cancelText="Hủy" width={isMobile ? 'calc(100vw - 24px)' : 520}>
      <Select mode="multiple" style={{ width: '100%' }} value={newMemberIds} options={addableMemberOptions} onChange={setNewMemberIds} placeholder="Chọn thành viên" />
    </Modal>
  </div>;
};

export default ChatHistoryPanel;
