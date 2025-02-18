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
import { LoadingComponent } from "../SideComponent/LoadingComponent";

export const MenuRightComponent = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();

  const getUserFromLocalStorage = localStorage.getItem('accessToken');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id } = getData;
  const idToNumber = +id;
  const { listFriendListOnline, error, loading } = useFacadeFriendListOnline(idToNumber);

  const items2 = [
    {
      key: "sub1",
      icon: <FaUserFriends />, // Correct usage
      label: "Online Friends",
      children: listFriendListOnline.map(friend => ({  // Map over the friend list
        key: friend.id.toString(), // Use friend.id as the key (converted to string)
        label: (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            key={friend.id.toString()} // Add key to the div
          >
            <ImageStatusAvatar
              image={friend.avatar} // Use friend.avatar as the image source
              style={{ marginTop: '45%', marginRight: '8px', width: '20px', height: '20px', borderRadius: '100%' }}
              active={true}
              preview={false}
            />
            <span>{friend.name}</span> {/* Use friend.name as the text */}
          </div>
        ),
        onClick: () => {
          navigate(`/profile/${friend.id}`);
        },
      }))
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