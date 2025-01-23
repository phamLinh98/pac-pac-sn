import { Avatar, Layout, Popconfirm, theme, Button } from "antd";
import { GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [isPopconfirmVisible, setPopconfirmVisible] = useState(false);
  const avatarRef = useRef(null);
  const [isPopupShow, setIsPopupShow] = useState(false);

  const onToggleMenu = (newValue) => {
    setCollapsed(newValue)
  }

  const navigate = useNavigate();
  const moveToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  const getLastWord = (str) => {
    if (!str || typeof str !== "string") return null;
    const words = str.trim().split(/\s+/);
    return words[words.length - 1] || null;
  };

  const data = getLastWord('Pham Tuan Linh');
  const headerItem = [
    {
      key: "1",
      label: <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <GrNotification style={{ fontSize: "17px" }} />
        <span style={{ fontSize: "16px", color: "white" }}>
          Notification
        </span>
      </div>
    },
    {
      key: "2",
      label: <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <SiMessenger style={{ fontSize: "17px" }} />
        <span style={{ fontSize: "16px", color: "white" }}>
          Messager
        </span>
      </div>
    },
    {
      key: "3",
      label: (
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          ref={avatarRef} // Gán ref cho div chứa avatar
          onClick={() => setPopconfirmVisible(true)} // Bật Popconfirm
        >
          <Avatar
            src="https://i.pinimg.com/736x/f2/a9/31/f2a9310be7d13bb02ffbb0bf3445a8b4.jpg"
            size="large"
            style={{ fontSize: "17px", color: "white" }}
          />
          <span style={{ fontSize: "16px", color: "white" }}>{data}</span>
        </div>
      ),
      //onClick: () => setIsPopupShow(pre => !pre)
      onClick: () => moveToProfile(456)
    },
  ];
  const handleConfirm = () => {
    setPopconfirmVisible(false);
    console.log("Confirmed");
    // Xử lý khi người dùng nhấn Yes
  };

  const handleCancel = () => {
    setPopconfirmVisible(false);
    console.log("Cancel");
    // Xử lý khi người dùng nhấn No
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <PrivateAreaComponent items={headerItem} onToggleMenu={onToggleMenu} collapsed={collapsed} />
      <Layout style={{ marginTop: 64 }}>
        <Sider
          width={collapsed ? 0 : 200}
          style={{
            background: colorBgContainer,
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 64,
            transition: "width 0.3s",
          }}
        >
          <MenuLeftComponent collapsed={collapsed} />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 0 : 200,
            padding: "0 24px 24px",
            overflow: "auto",
            height: "calc(100vh - 64px)",
            transition: "margin-left 0.3s"
          }}
        >
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: "100%",
              background: "none",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
        {isPopupShow ? <Popconfirm
          title="Thông tin cá nhân"
          description="Are you sure to delete this task?"
          open={isPopconfirmVisible}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          // okText="Yes"
          // cancelText="No"
          trigger="click"
          placement="bottom"
          getPopupContainer={() => avatarRef.current} // Sử dụng ref để set container
        >
        </Popconfirm> : ''}
      </Layout>
    </Layout>
  );
};