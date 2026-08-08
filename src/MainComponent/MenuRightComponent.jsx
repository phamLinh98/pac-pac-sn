import { useCallback, useEffect, useState } from 'react';
import { Avatar, Badge, Empty, Menu, Spin } from 'antd';
import { FaUserFriends } from 'react-icons/fa';
import { GrGroup } from 'react-icons/gr';
import { MdPhoneIphone } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getFriendPresenceApi } from '../api/restApiConfig';

// eslint-disable-next-line react/prop-types
export const MenuRightComponent = ({ collapsed }) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['friends']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPresence = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await getFriendPresenceApi();
      setFriends(Array.isArray(result) ? result : []);
    } catch {
      if (!silent) setFriends([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPresence();
    const timer = window.setInterval(() => loadPresence(true), 30000);
    const refresh = () => loadPresence(true);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [loadPresence]);

  useEffect(() => setOpenKeys(collapsed ? [] : ['friends']), [collapsed]);

  const friendItems = friends.map((friend) => ({
    key: `friend-${friend.id}`,
    label: <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <Badge dot={Boolean(friend.is_online)} color="#22c55e" offset={[-2, 22]}>
        <Avatar src={friend.avatar} size={28}>{friend.name?.[0]}</Avatar>
      </Badge>
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.name || 'Người dùng'}</span>
      {!friend.is_online && <MdPhoneIphone title="Offline" aria-label="Offline" style={{ flexShrink: 0, color: '#8c8c8c', fontSize: 16 }} />}
    </div>,
    onClick: () => navigate(`/profile/${friend.id}`),
  }));

  const items = [
    {
      key: 'friends',
      icon: <FaUserFriends />,
      label: 'Online Friends',
      children: loading
        ? [{ key: 'loading', disabled: true, label: <div style={{ textAlign: 'center' }}><Spin size="small" /></div> }]
        : friendItems.length
          ? friendItems
          : [{ key: 'empty', disabled: true, label: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bạn bè" /> }],
    },
    { key: 'groups', icon: <GrGroup />, label: 'Groups' },
  ];

  return <Menu
    mode="inline"
    style={{ height: '100%', borderRight: 0 }}
    items={items}
    openKeys={openKeys}
    selectedKeys={selectedKeys}
    onOpenChange={setOpenKeys}
    onClick={({ key }) => setSelectedKeys([key])}
  />;
};
