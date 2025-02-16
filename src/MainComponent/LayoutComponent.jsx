import { Avatar, Layout, theme } from "antd";
import { GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const [collapsed, setCollapsed] = useState(false);
  const avatarRef = useRef(null);

  // Toggle function to open/close left menu
  const onToggleMenu = (newValue) => {
    setCollapsed(newValue)
  }

  // Navigate to profile 
  const navigate = useNavigate();
  const moveToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  //Get user info saved from localstorage and decode user
  const getUserFromLocalStorage = localStorage.getItem('accessToken');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id, name, avatar } = getData;

  // Function Show name just FamilyName Name > Name
  const getLastWord = (str) => {
    if (!str || typeof str !== "string") return null;
    const words = str.trim().split(/\s+/);
    return words[words.length - 1] || null;
  };
  
  // Call getLastWord function and give to dataNameFromObject
  const dataNameFromObject = getLastWord(name);

  // List icon and function in top menu(notification, profile, message)
  const headerItem = [
    {
      key: "1",
      label: <GrNotification style={{ fontSize: "17px" }} />
    },
    {
      key: "2",
      label: <SiMessenger style={{ fontSize: "17px" }} />
    },
    {
      key: "3",
      label: (
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          ref={avatarRef} // Gán ref cho div chứa avatar
        >
          <Avatar
            src={avatar ? avatar : 'https://i.pinimg.com/736x/13/7b/ae/137bae39718b4e4ee171435e15ec7c9c.jpg'}
            size="large"
            style={{ fontSize: "17px", color: "white" }}
          />
          <span style={{ fontSize: "16px", color: "white" }}>{dataNameFromObject}</span>
        </div>
      ),
      //onClick: () => setIsPopupShow(pre => !pre)
      onClick: () => moveToProfile(id)
    },
  ];

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
      </Layout>
    </Layout>
  );
};