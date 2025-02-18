import React from 'react';
import { Tabs, Layout } from 'antd'; // Import Layout từ antd
import { FaRegFileImage, FaRegFileVideo } from 'react-icons/fa';
import { BsFileEarmarkPost } from 'react-icons/bs';
import { ProfileComponent } from './ProfileComponent';

export const FriendOrMyProfileComponent = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: <span><BsFileEarmarkPost />NewFeed</span>,
      children: <ProfileComponent />,
    },
    {
      key: '2',
      label: <span><FaRegFileImage />Image</span>,
      children: 'Thư mục ảnh của A',
    },
    {
      key: '3',
      label: <span><FaRegFileVideo />Video</span>,
      children: 'Content of Tab Pane 3',
    },
  ];
  return (
    <div> {/* Bọc Tabs và Footer trong div */}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};