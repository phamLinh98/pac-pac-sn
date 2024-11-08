import React from "react";

import { Breadcrumb, Layout, Menu, theme } from "antd";
import { FaUserFriends } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { GrGroup, GrNotification } from "react-icons/gr";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { TbBrandGravatar } from "react-icons/tb";
import { CardComponent } from "../SideComponent/CardComponent";

const headerItem = [
  {
    key: "1",
    label: <GrNotification style={{fontSize:"17px"}}/>,
  },
  {
    key: "2",
    label: <SiMessenger style={{fontSize:"17px"}}/>,
  },
  {
    key: "3",
    label: <TbBrandGravatar style={{fontSize:"17px"}}/>,
  },
];

const items2 = [RxAvatar, FaUserFriends, GrGroup].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={headerItem}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            justifyContent: "flex-end", // Căn các items1 sang phải
          }}
        />
      </Header>

      <Layout style={{ marginTop: 64 }}>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 64,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
            padding: "0 24px 24px",
            overflow: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "List",
              },
              {
                title: "App",
              },
            ]}
            style={{
              margin: "16px 0",
            }}
          />
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: "100%",
              background: "none",
            }}
          >
            <CardComponent/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
