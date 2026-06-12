import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";

import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { PopupProvider } from "./context/popup/PopupProvider.jsx";
import { ThemeProvider } from "./context/theme/ThemeProvider.jsx";
import { NotificationsProvider } from "./context/notification/NotificationsProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily: "Poppins, sans-serif",
      },
    }}
  >
    <ThemeProvider>
      <NotificationsProvider>
        <PopupProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <App />
            </GoogleOAuthProvider>
          </AuthProvider>
        </PopupProvider>
      </NotificationsProvider>
    </ThemeProvider>
  </ConfigProvider>,
);
