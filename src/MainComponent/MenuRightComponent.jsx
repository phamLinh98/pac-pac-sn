import React, { useState, useEffect } from "react";
import { Menu, Switch } from "antd";
import { RxAvatar } from "react-icons/rx";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { ImageStatus } from "../SideComponent/ImageStatus";
import { useFacadeFriendListOnline } from "../reduxs/useFacadeFriendListOnline";

export const MenuRightComponent = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();

  const getUserFromLocalStorage = localStorage.getItem('accessToken');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id, name, avatar } = getData;
  console.log('id', id)

  const {listFriendListOnline, error, loading} = useFacadeFriendListOnline(567);
  console.log('listFriendListOnline', listFriendListOnline);

  const items2 = [
    {
      key: "sub1",
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
      key: "sub2",
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