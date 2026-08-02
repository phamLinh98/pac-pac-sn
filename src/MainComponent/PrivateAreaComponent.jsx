/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { AutoComplete, Avatar, Input, Layout, Menu, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import { searchUsersApi } from "../api/restApiConfig";
const { Header } = Layout;

export const PrivateAreaComponent = ({ items, backgroundImage, isMobile }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const keyword = searchText.trim();

    if (keyword.length < 2) {
      setSearchOptions([]);
      setIsSearching(false);
      return undefined;
    }

    let isActive = true;
    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const users = await searchUsersApi(keyword);

        if (isActive) {
          setSearchOptions(
            users.map((user) => ({
              value: String(user.id),
              userId: user.id,
              label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar src={user.avatar} size={30} />
                  <span>{user.name || "Người dùng"}</span>
                </div>
              ),
            }))
          );
        }
      } catch (error) {
        if (isActive) {
          console.error("Không thể tìm kiếm user:", error);
          setSearchOptions([]);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [searchText]);

  const handleSelectUser = (_value, option) => {
    const userId = Number(option?.userId);

    if (Number.isFinite(userId) && userId > 0) {
      setSearchText("");
      setSearchOptions([]);
      navigate(`/profile/${userId}`);
    }
  };

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
      {!isMobile && (
        <AutoComplete
          value={searchText}
          options={searchOptions}
          onSearch={setSearchText}
          onSelect={handleSelectUser}
          popupMatchSelectWidth={300}
          notFoundContent={isSearching ? <Spin size="small" /> : "Không tìm thấy user"}
          style={{ width: "15%", minWidth: 200 }}
        >
          <Input.Search placeholder="Search User" allowClear loading={isSearching} />
        </AutoComplete>
      )}
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
