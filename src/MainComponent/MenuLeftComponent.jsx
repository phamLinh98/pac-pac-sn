import { useState, useEffect } from "react";
import { Avatar, Menu, Select, Switch } from "antd";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { MdAccountCircle } from "react-icons/md";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { logoutClearToken as logoutApi } from "../api/restApiConfig";
import { AccountSettingsButton } from "../SideComponent/AccountSettingsButton";
import { getRenderableImageUrl } from "../utils/imageUrl";

// eslint-disable-next-line react/prop-types
export const MenuLeftComponent = ({ collapsed }) => {
  const { themeMode, setThemeMode, language, setLanguage, t } =
    useAppSettings();
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [userToken, setUserToken] = useState(() => localStorage.getItem("allow-login"));
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutApi("/logout");
    localStorage.removeItem("allow-login");
    setUserToken(null);
    navigate("/login", { replace: true });
  }

  const getData = decodeJwt(userToken) ?? {};
  const { id, name, avatar } = getData;
  const currentAvatar = getRenderableImageUrl(
    localStorage.getItem(`pac-pac-profile-avatar-${id}`) || avatar
  );

  const moveToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  const items2 = [
    {
      key: "sub1",
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 42 }}>
          <Avatar src={currentAvatar || ''} size={32} style={{ flex: '0 0 32px' }}>
            {name?.[0]}
          </Avatar>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        </div>
      ),
      onClick: () => moveToProfile(id)
    },
    {
      key: "sub2",
      icon: <FaUserFriends />, // Correct usage
      label: t.friends,
      onClick: () => navigate('/friends'),
    },
    {
      key: "sub3",
      icon: <GrGroup />, // Correct usage
      label: t.groups,
    },
    {
      key: "sub4",
      icon: <IoSettingsOutline />,
      label: t.setting,
      children: [
        {
          key: "setting-theme",
          label: (
            <div
              onClick={(event) => event.stopPropagation()}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span>{t.theme}</span>
              <Switch
                checked={themeMode === "dark"}
                checkedChildren={t.dark}
                unCheckedChildren={t.light}
                onChange={(checked) => setThemeMode(checked ? "dark" : "light")}
              />
            </div>
          ),
        },
        {
          key: "setting-language",
          style: {
            height: 76,
            lineHeight: "normal",
            paddingTop: 8,
            paddingBottom: 8,
          },
          label: (
            <div
              onClick={(event) => event.stopPropagation()}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <span>{t.language}</span>
              <Select
                size="small"
                value={language}
                onChange={setLanguage}
                aria-label={t.language}
                popupMatchSelectWidth={180}
                style={{ width: 140 }}
                options={[
                  { value: "ja", label: "日本語" },
                  { value: "en", label: "English" },
                  { value: "vi", label: "Tiếng Việt" },
                ]}
              />
            </div>
          ),
        },
        {
          key: "setting-account",
          label: (
            <div onClick={(event) => event.stopPropagation()}>
              <AccountSettingsButton currentName={name} onUpdated={setUserToken} block />
            </div>
          ),
        },
      ]
    },
    {
      key: "sub5",
      icon:<MdAccountCircle/>,
      label: t.createAccount,
      onClick: () => navigate('/register')
    },
    {
      key: "sub6",
      icon: <GrLogout />,
      label: t.logout,
      onClick: handleLogout
    }
  ];

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key]);
  };

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else {
      setOpenKeys(["sub1"])
    }
  }, [collapsed]);

  return (
    <Menu
      mode="inline"
      style={{
        height: "100%",
        borderRight: 0,
      }}
      items={items2}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      onClick={handleMenuClick}
    />
  );
};
