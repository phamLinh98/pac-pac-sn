import { Layout,theme } from "antd";
import { FaUserFriends } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { GrGroup, GrNotification } from "react-icons/gr";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SiMessenger } from "react-icons/si";
import { TbBrandGravatar } from "react-icons/tb";
import { MainShowStatusAndStory } from "./MainShowStatusAndStory";
import { MenuLeftComponent } from "./MenuLeftComponent";
import { PrivateAreaComponent } from "./PrivateAreaComponent";

// item for Header Menu
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

// items for Left Menu
const items2 = [
  {
    key: "sub1",
    icon: <RxAvatar />, // Correct usage
    label: "Home",
  },
  {
    key: "sub2",
    icon: <FaUserFriends />, // Correct usage
    label: "Online Friends",
    children: [
      {
        key: 5,
        label: "Liễu Như Yên",
      },
      {
        key: 6,
        label: "Liễu Như Yên",
      },
      {
        key: 7,
        label: "Liễu Như Yên",
      },
      {
        key: 8,
        label: "Liễu Như Yên",
      },
    ],
  },
  {
    key: "sub3",
    icon: <GrGroup />, // Correct usage
    label: "Groups",
    children: [
      {
        key: 9,
        label: "ScriptChat",
      },
      {
        key: 10,
        label: "ScriptChat",
      },
      {
        key: 11,
        label: "ScriptChat",
      },
      {
        key: 12,
        label: "ScriptChat",
      },
    ],
  },
];

export const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>

      {/* TODO: Solve Header */}
      <PrivateAreaComponent items={headerItem}/>
      
      {/* TODO:Solve Content */}
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
          <MenuLeftComponent items={items2}/>
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
            padding: "0 24px 24px",
            overflow: "auto",
            height: "calc(100vh - 64px)",
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
            <MainShowStatusAndStory/>
          </Content>
        </Layout>
      </Layout>

    </Layout>
  );
};
