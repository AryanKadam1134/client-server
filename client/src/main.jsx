import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { PopupProvider } from "./context/PopupContext.jsx";
import { NotificationsProvider } from "./context/NotificationContext.jsx";

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
