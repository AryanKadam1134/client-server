import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, theme } from "antd";

import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationsProvider } from "./context/NotificationContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily: "Poppins, sans-serif",
      },
    }}
  >
    <ThemeProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  </ConfigProvider>,
);
