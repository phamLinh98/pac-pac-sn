import { Button, Input, Layout, Menu } from "antd";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
const { Header } = Layout;

export const PrivateAreaComponent = ({ items, onToggleMenu, collapsed }) => {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        width: "100%",
        zIndex: 1,
        padding: "0 24px"
      }}
    >
      <Input placeholder="Search User" style={{width:"15%"}}/>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}> {/* Thay đổi ở đây */}
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{
            minWidth: 0,
            alignItems: 'center'
          }}
        />
      </div>
    </Header>
  );
};