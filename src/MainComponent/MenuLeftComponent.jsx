import React, { useState, useEffect } from "react";
import { Menu, Switch } from "antd";
import { RxAvatar } from "react-icons/rx";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { ImageStatus } from "../SideComponent/ImageStatus";

export const MenuLeftComponent = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();

  const logoutClearToken = () => {
    localStorage.removeItem('allow-login');
    navigate('/login');
  }

  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id, name, avatar } = getData;

  const moveToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  const items2 = [
    {
      key: "sub1",
      icon: (
        <ImageStatus
          image={avatar ? avatar : ''}
          width={30}
          height={30}
          style={{
            borderRadius: '100%',
            marginTop: '8px',
            marginRight: '10px',
          }}
          preview={false}
        />
      ),
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: '0 0 0 5px' }}>{name}</p>
        </div>
      ),
      onClick: () => moveToProfile(id)
    },
    {
      key: "sub2",
      icon: <FaUserFriends />, // Correct usage
      label: "Friends",
    },
    {
      key: "sub3",
      icon: <GrGroup />, // Correct usage
      label: "Groups",
    },
    {
      key: "sub4",
      icon: <IoSettingsOutline />,
      label: "Setting",
      children: [
        {
          key: 1,
          label: <>
            <Switch checkedChildren="Black" unCheckedChildren="White" defaultChecked />
          </>,
        },
        {
          key: 2,
          label: <>
            Language
          </>,
        },
      ]
    },
    {
      key: "sub5",
      icon: <GrLogout />,
      label: "Logout",
      onClick: logoutClearToken
    },
  ];

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
  };

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else {
      setOpenKeys(["sub1"])
    }
  }, [collapsed]);

  return (
    <Menu
      mode="inline"
      style={{
        height: "100%",
        borderRight: 0,
      }}
      items={items2}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      onClick={handleMenuClick}
    />
  );
};