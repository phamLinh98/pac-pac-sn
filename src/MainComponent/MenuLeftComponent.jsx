import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { RxAvatar } from "react-icons/rx";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export const MenuLeftComponent = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();

  const backToMenu = () => {
    navigate('/home')
  }

  const logoutClearToken = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }
  
  const items2 = [
    {
      key: "sub1",
      icon: <RxAvatar/>, // Correct usage
      label: "Home",
      onClick:backToMenu
    },
    {
      key: "sub2",
      icon: <FaUserFriends />, // Correct usage
      label: "Online Friends",
      children: [
        {
          key: 5,
          label: "Liễu Như Yên",
        },
        {
          key: 6,
          label: "Liễu Như Yên",
        },
        {
          key: 7,
          label: "Liễu Như Yên",
        },
        {
          key: 8,
          label: "Liễu Như Yên",
        },
      ],
    },
    {
      key: "sub3",
      icon: <GrGroup />, // Correct usage
      label: "Groups",
      children: [
        {
          key: 9,
          label: "ScriptChat",
        },
        {
          key: 10,
          label: "ScriptChat",
        },
        {
          key: 11,
          label: "ScriptChat",
        },
        {
          key: 12,
          label: "ScriptChat",
        },
      ],
    },
    {
      key: "sub4",
      icon: <GrLogout />, // Correct usage
      label: "Logout",
      onClick:logoutClearToken
    }
  ];

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

    const handleMenuClick = (e) => {
        setSelectedKeys([e.key]);
    };

    useEffect(() => {
        if(collapsed){
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