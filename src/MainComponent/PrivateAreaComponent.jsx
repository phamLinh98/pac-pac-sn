/* eslint-disable react/prop-types */
import { Menu } from "antd"
import { Header } from "antd/es/layout/layout"

export const PrivateAreaComponent = ({items}) => {
  return <Header
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
      defaultSelectedKeys={["3"]}
      items={items}
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        justifyContent: "flex-end", // Căn các items1 sang phải
      }}
    />
  </Header>
}