import { Layout, theme } from "antd";
import { FaSnowman } from "react-icons/fa";
import { GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { TbBrandGravatar } from "react-icons/tb";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// item for Header Menu
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
    label: <TbBrandGravatar style={{ fontSize: "17px" }} />,
  },
  {
    key:"4",
    label:<FaSnowman style={{ fontSize: "17px" }} />
  }
];

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

    const onToggleMenu = (newValue) => {
          setCollapsed(newValue)
      }
  return (
    <Layout style={{ height: "100vh" }}>
      {/* TODO: Solve Header */}
      <PrivateAreaComponent items={headerItem} onToggleMenu={onToggleMenu} collapsed={collapsed}/>

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
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};