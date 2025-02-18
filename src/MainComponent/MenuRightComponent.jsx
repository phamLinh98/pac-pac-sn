import React, { useState, useEffect } from "react";
import { Menu, Switch } from "antd";
import { RxAvatar } from "react-icons/rx";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { ImageStatus, ImageStatusAvatar } from "../SideComponent/ImageStatus";
import { useFacadeFriendListOnline } from "../reduxs/useFacadeFriendListOnline";

export const MenuRightComponent = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();

  const getUserFromLocalStorage = localStorage.getItem('accessToken');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id, name, avatar } = getData;
  console.log('getData', getData)
  const idToNumber = +id;
  const {listFriendListOnline, error, loading} = useFacadeFriendListOnline(idToNumber);
  console.log('listFriendListOnline', listFriendListOnline);

  const items2 = [
    {
      key: "sub1",
      icon: <FaUserFriends />, // Correct usage
      label: "Online Friends",
      children: [
        {
          key: 1,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageStatusAvatar
                image="https://i.pinimg.com/736x/8e/72/3a/8e723a1f58efc02a33d6e37669297df6.jpg" // Replace with the actual URL of your image
                style={{ marginTop:"45%",marginRight: '8px', width: '20px', height: '20px', borderRadius:'100%' }} // Adjust size and spacing
                active={true}
                preview={false}
              />
              <span>Liễu Như Yên</span>
            </div>
          ),
        },
        {
          key: 2,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageStatusAvatar
                image="https://i.pinimg.com/736x/8e/72/3a/8e723a1f58efc02a33d6e37669297df6.jpg" // Replace with the actual URL of your image
                style={{ marginTop:"45%",marginRight: '8px', width: '20px', height: '20px', borderRadius:'100%' }} // Adjust size and spacing
                active={true}
                preview={false}
              />
              <span>Liễu Như Yên</span>
            </div>
          ),
        },
        {
          key: 3,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageStatusAvatar
                image="https://i.pinimg.com/736x/8e/72/3a/8e723a1f58efc02a33d6e37669297df6.jpg" // Replace with the actual URL of your image
                style={{ marginTop:"45%",marginRight: '8px', width: '20px', height: '20px', borderRadius:'100%' }} // Adjust size and spacing
                active={true}
                preview={false}
              />
              <span>Liễu Như Yên</span>
            </div>
          ),
        },
        {
          key: 4,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageStatusAvatar
                image="https://i.pinimg.com/736x/8e/72/3a/8e723a1f58efc02a33d6e37669297df6.jpg" // Replace with the actual URL of your image
                style={{ marginTop:"45%",marginRight: '8px', width: '20px', height: '20px', borderRadius:'100%' }} // Adjust size and spacing
                active={true}
                preview={false}
              />
              <span>Liễu Như Yên</span>
            </div>
          ),
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