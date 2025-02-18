import { Avatar, Layout, theme } from "antd";
import { GrHomeRounded, GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiGooglemarketingplatform, SiMessenger } from "react-icons/si";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { FaHome, FaPhotoVideo } from "react-icons/fa";
import { PiGameController } from "react-icons/pi";
import { MenuRightComponent } from "./MenuRightComponent";
import { IoMdPersonAdd } from "react-icons/io";

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  // Toggle function to open/close left menu
  // const onToggleMenu = (newValue) => {
  //   setCollapsed(newValue)
  // }

  // Navigate to profile 
  const navigate = useNavigate();
  const backToMenu = () => {
    navigate('/home')
  }
  // List icon and function in top menu(notification, profile, message)
  const headerItem = [
    {
      key: "1",
      label: <GrHomeRounded style={{ fontSize: "17px" }} />,
      onClick: backToMenu
    },
    {
      key: "2",
      label: <SiMessenger style={{ fontSize: "17px" }} />
    },
    {
      key: "3",
      label: <GrNotification style={{ fontSize: "17px" }} />
    },
    {
      key: "4",
      label: <PiGameController style={{ fontSize: "17px" }} />
    }, {
      key: "5",
      label: <FaPhotoVideo style={{ fontSize: "17px" }} />
    },
    {
      key: "6",
      label: <IoMdPersonAdd style={{ fontSize: "17px" }} />
    }
  ];

  return (
    <Layout style={{ height: "200vh" }}>
      <PrivateAreaComponent items={headerItem} collapsed={collapsed} />
      <Layout style={{ marginTop: 64 }}>
        {/* Left Sider */}
        <Sider
          width={collapsed ? 0 : 200}
          style={{
            background: colorBgContainer,
            position: "fixed",
            height: "calc(100vh - 64px)", // Chiều cao trừ header
            left: 0,
            top: 64,
            transition: "width 0.3s",
            zIndex: 2, // Đảm bảo Sider không bị che bởi content
          }}
        >
          <MenuLeftComponent collapsed={collapsed} />
        </Sider>

        {/* Content */}
        <Layout
          style={{
            marginLeft: collapsed ? 0 : 200,
            marginRight: collapsed ? 0 : 200,
            padding: "0 24px 24px",
            height: "calc(100vh - 64px)", // Viewport height minus header
            transition: "margin-left 0.3s, margin-right 0.3s",
            display: "flex",            // Enable flexbox for Layout
            flexDirection: "column",     // Arrange children vertically
          }}
        >
          <Content
            style={{
              padding: 0,
              margin: 0,
              background: "none",
              flex: 1,                // Allow Content to grow and take up remaining space
              //overflow: "auto",        // Enable scrolling for Content only
            }}
          >
            <Outlet />
          </Content>
        </Layout>

        {/* Right Sider */}
        <Sider
          width={collapsed ? 0 : 200}
          style={{
            background: colorBgContainer,
            position: "fixed",
            height: "calc(100vh - 64px)", // Chiều cao trừ header
            right: 0,
            top: 64,
            transition: "width 0.3s",
            zIndex: 2, // Đảm bảo Sider không bị che bởi content
          }}
        >
          <MenuRightComponent />
        </Sider>
      </Layout>
    </Layout>
  )
};