import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Avatar, Input, Popover, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { searchUsersApi } from '../api/restApiConfig';

const MobileUserSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const query = keyword.trim();
    if (query.length < 2) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const users = await searchUsersApi(query);
        if (active) setOptions(users.map((user) => ({
          value: String(user.id),
          userId: Number(user.id),
          label: <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Avatar src={user.avatar} size={28} />
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Người dùng'}</span>
          </div>,
        })));
      } catch {
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [keyword]);

  const selectUser = (_value, option) => {
    if (!option?.userId) return;
    setOpen(false);
    setKeyword('');
    setOptions([]);
    navigate(`/profile/${option.userId}`);
  };

  return <Popover
    open={open}
    onOpenChange={setOpen}
    trigger="click"
    placement="bottomLeft"
    content={<div style={{ width: 'min(50vw, 220px)' }}>
      <AutoComplete
        value={keyword}
        options={options}
        onSearch={setKeyword}
        onSelect={selectUser}
        popupMatchSelectWidth
        notFoundContent={loading ? <Spin size="small" /> : keyword.trim().length >= 2 ? 'Không tìm thấy user' : 'Nhập ít nhất 2 ký tự'}
        style={{ width: '100%' }}
      >
        <Input ref={inputRef} prefix={<SearchOutlined />} placeholder="Tìm kiếm user" allowClear />
      </AutoComplete>
    </div>}
  >
    <SearchOutlined aria-label="Tìm kiếm user" style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }} />
  </Popover>;
};

export default MobileUserSearch;
