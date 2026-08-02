import { useState, useEffect } from "react";
import { Menu, Select, Switch } from "antd";
import { FaUserFriends } from "react-icons/fa";
import { GrGroup, GrLogout } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";
import { ImageStatus } from "../SideComponent/ImageStatus";
import { MdAccountCircle } from "react-icons/md";
import { useAppSettings } from "../contexts/AppSettingsContext";

// eslint-disable-next-line react/prop-types
export const MenuLeftComponent = ({ collapsed }) => {
  const { themeMode, setThemeMode, language, setLanguage, t } =
    useAppSettings();
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const navigate = useNavigate();
  const { id: routeProfileId } = useParams();

  const logoutClearToken = () => {
    localStorage.removeItem('allow-login');
    navigate('/login');
  }

  const getUserFromLocalStorage = localStorage.getItem('allow-login');
  const getData = decodeJwt(getUserFromLocalStorage);
  const { id, name, avatar } = getData;

  const routeUserId = Number(routeProfileId);
  const targetProfileId = Number.isFinite(routeUserId) && routeUserId > 0
    ? routeUserId
    : id;

  const moveToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  const items2 = [
    {
      key: "sub1",
      icon: (
        <ImageStatus
          image={avatar ? avatar : ''}
          width={30}
          height={30}
          style={{
            borderRadius: '100%',
            marginTop: '8px',
            marginRight: '10px',
          }}
          preview={false}
        />
      ),
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: '0 0 0 5px' }}>{name}</p>
        </div>
      ),
      onClick: () => moveToProfile(targetProfileId)
    },
    {
      key: "sub2",
      icon: <FaUserFriends />, // Correct usage
      label: t.friends,
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
      onClick: logoutClearToken
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
