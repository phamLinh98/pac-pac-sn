import { Avatar, Layout, theme } from "antd";
import { GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const onToggleMenu = (newValue) => {
    setCollapsed(newValue)
  }

  const navigate = useNavigate();
  const moveToProfile = () => {
    navigate('/profile');
  }

  const headerItem = [
    {
      key: "1",
      label: <GrNotification style={{ fontSize: "17px" }} />,
    },
    {
      key: "2",
      label: <SiMessenger style={{ fontSize: "17px" }} />,
    },
    {
      key: "3",
      label: (<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Avatar
          src="https://i.pinimg.com/736x/f2/a9/31/f2a9310be7d13bb02ffbb0bf3445a8b4.jpg"
          size="large"
          icon={<UserOutlined />}
          style={{ fontSize: "17px", color: "white" }}
        />
        <span style={{ fontSize: "16px", color: "white" }}>
          Phạm Tuấn Linh
        </span>
      </div>),
      onClick:moveToProfile
    }
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      {/* TODO: Solve Header */}
      <PrivateAreaComponent items={headerItem} onToggleMenu={onToggleMenu} collapsed={collapsed} />

      {/* TODO:Solve Content */}
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
      </Layout>
    </Layout>
  );
};