import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
const { Header } = Layout;

export const PrivateAreaComponent = ({ items, onToggleMenu, collapsed }) => {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
    const toggleCollapsed = () => {
        setLocalCollapsed(!localCollapsed);
        onToggleMenu(!localCollapsed)
  };
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Button onClick={toggleCollapsed}>
            {localCollapsed ? <IoMenu/> :<IoMenu/>}
        </Button>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["3"]}
            items={items}
             style={{
                minWidth: 0,
             }}
         />
       </div>
    </Header>
  );
};