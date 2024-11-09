/* eslint-disable react/prop-types */
import { Menu } from "antd"

export const MenuLeftComponent = ({items}) => {
    return <Menu
    mode="inline"
    defaultSelectedKeys={["1"]}
    defaultOpenKeys={["sub1"]}
    style={{
      height: "100%",
      borderRight: 0,
    }}
    items={items}
  />
}