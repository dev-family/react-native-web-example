type TelegramTheme = {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
  header_bg_color: string;
  accent_text_color: string;
  section_bg_color: string;
  section_header_text_color: string;
  section_separator_color: string;
  subtitle_text_color: string;
  destructive_text_color: string;
};

type WebAppUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  is_premium: boolean;
  photo_url: string;
};

type WebappData = {
  user: WebAppUser;
};

type TelegramHapticFeedback = {
  impactOccurred: (
    style: "light" | "medium" | "rigid" | "heavy" | "soft",
  ) => Promise<void>;
  notificationOccurred: (
    type: "error" | "success" | "warning",
  ) => Promise<void>;
};

type TelegramWebapp = {
  initData: string;
  initDataUnsafe: WebappData;
  version: string;
  platform: string;
  themeParams: TelegramTheme;
  headerColor: string;
  backgroundColor: string;
  expand: () => void;
  close: () => void;
  HapticFeedback: TelegramHapticFeedback;
};

type Window = {
  Telegram?: {
    WebApp: TelegramWebapp;
  };
};

declare var window: Window;
