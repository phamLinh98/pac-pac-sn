/* eslint-disable react/prop-types */
import { Input, Layout, Menu } from "antd";
const { Header } = Layout;

export const PrivateAreaComponent = ({ items, backgroundImage, isMobile }) => {

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        width: "100%",
        zIndex: 1000,
        padding: isMobile ? "0 8px" : "0 24px",

        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.35),
            rgba(0, 0, 0, 0.35)
          ),
          url("${backgroundImage}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!isMobile && <Input placeholder="Search User" style={{width:"15%"}}/>}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minWidth: 0 }}> {/* Thay đổi ở đây */}
        <Menu
          mode="horizontal"
          items={items}
          style={{
            background: "transparent",
            borderBottom: "none",
            color: "#fff",
          }}
        />
      </div>
    </Header>
  );
};
