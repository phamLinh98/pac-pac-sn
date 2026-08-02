/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import viVN from "antd/locale/vi_VN";

const THEME_STORAGE_KEY = "pac-pac-theme";
const LANGUAGE_STORAGE_KEY = "pac-pac-language";

const translations = {
  vi: {
    friends: "Bạn bè", groups: "Nhóm", setting: "Cài đặt",
    theme: "Giao diện", language: "Ngôn ngữ", dark: "Đen", light: "Trắng",
    createAccount: "Tạo tài khoản", logout: "Đăng xuất",
  },
  en: {
    friends: "Friends", groups: "Groups", setting: "Settings",
    theme: "Theme", language: "Language", dark: "Black", light: "White",
    createAccount: "Create Account", logout: "Logout",
  },
  ja: {
    friends: "友達", groups: "グループ", setting: "設定",
    theme: "テーマ", language: "言語", dark: "ブラック", light: "ホワイト",
    createAccount: "アカウント作成", logout: "ログアウト",
  },
};

const localeByLanguage = { vi: viVN, en: enUS, ja: jaJP };
const AppSettingsContext = createContext(null);

const readStoredTheme = () =>
  localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";

const readStoredLanguage = () => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return ["vi", "en", "ja"].includes(storedLanguage) ? storedLanguage : "vi";
};

// eslint-disable-next-line react/prop-types
export const AppSettingsProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(readStoredTheme);
  const [language, setLanguage] = useState(readStoredLanguage);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const contextValue = useMemo(
    () => ({
      themeMode, setThemeMode, language, setLanguage, t: translations[language],
    }),
    [language, themeMode]
  );

  return (
    <AppSettingsContext.Provider value={contextValue}>
      <ConfigProvider
        locale={localeByLanguage[language]}
        theme={{
          algorithm:
            themeMode === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings phải được dùng trong AppSettingsProvider");
  }
  return context;
};
