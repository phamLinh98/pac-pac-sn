import React, { useState, useEffect } from "react";
import { Menu } from "antd";

export const MenuLeftComponent = ({ items, collapsed }) => {
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);


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
      items={items}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      onClick={handleMenuClick}
    />
  );
};