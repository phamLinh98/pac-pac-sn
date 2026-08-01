import { Avatar, Layout, theme } from "antd";
import { GrHomeRounded } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGameController } from "react-icons/pi";
import { MenuRightComponent } from "./MenuRightComponent";
import NotificationIcon from "../SideComponent/ButtonNewNotification";
import ChatHistoryPanel from "../SideComponent/ChatHistoryPanel";
import NotificationsPanel from "../SideComponent/NotificationsPanel";
import PropTypes from "prop-types";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

const MOBILE_BREAKPOINT = 430;

PrivateAreaComponent.propTypes = {
    items: PropTypes.array.isRequired,
    onToggleMenu: PropTypes.func,
    collapsed: PropTypes.bool,
    backgroundImage: PropTypes.string,
    isMobile: PropTypes.bool,
};

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // eslint-disable-next-line no-unused-vars
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`
    );
    const handleViewportChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  // Navigate to profile
  const navigate = useNavigate();
  const backToMenu = () => {
    navigate('/home')
  }

  const loginUser = decodeJwt(localStorage.getItem("allow-login")) ?? {};
  const loginUserId = Number(loginUser.id);
  const moveToMyProfile = () => {
    if (Number.isFinite(loginUserId) && loginUserId > 0) {
      navigate(`/profile/${loginUserId}`);
    }
  };

  const headerBackgroundImage =
    "https://i.pinimg.com/vwebp/1200x/d9/b2/97/d9b29715b473dd0a5b37e1bc9929907b.webp";
  // List icon and function in top menu(notification, profile, message)
  const menuItemStyle = {
    background: "transparent",
    color: "#fff",
    borderRadius: "8px",
  };

  const headerItem = [
    ...(isMobile
      ? [
          {
            key: "mobile-profile",
            label: (
              <Avatar
                src={loginUser.avatar}
                size={30}
                style={{ cursor: "pointer" }}
              />
            ),
            onClick: moveToMyProfile,
            style: menuItemStyle,
          },
        ]
      : []),
    {
      key: "1",
      label: <GrHomeRounded style={{ fontSize: 17 }} />,
      onClick: backToMenu,
      style: menuItemStyle,
    },
    {
      key: "2",
      label: <ChatHistoryPanel />,
      style: menuItemStyle,
    },
    {
      key: "3",
      label: <NotificationsPanel />,
      style: menuItemStyle,
    },
    {
      key: "4",
      label: <PiGameController style={{ fontSize: 17 }} />,
      style: menuItemStyle,
    },
    {
      key: "5",
      label: <FaPhotoVideo style={{ fontSize: 17 }} />,
      style: menuItemStyle,
    },
    {
      key: "6",
      label: <NotificationIcon />,
      style: menuItemStyle,
    },
  ];

  return (
    <Layout style={{ height: "200vh" }}>
      <PrivateAreaComponent
        items={headerItem}
        collapsed={collapsed}
        backgroundImage={headerBackgroundImage}
        isMobile={isMobile}
      />
      <Layout style={{ marginTop: 64 }}>
        {/* Left Sider */}
        {!isMobile && <Sider
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
        </Sider>}

        {/* Content */}
        <Layout
          style={{
            marginLeft: isMobile || collapsed ? 0 : 200,
            marginRight: isMobile || collapsed ? 0 : 200,
            padding: isMobile ? "0 8px 16px" : "0 24px 24px",
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
        {!isMobile && <Sider
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
        </Sider>}
      </Layout>
    </Layout>
  )
};
