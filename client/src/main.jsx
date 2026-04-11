import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ApiProvider } from "./context/ThirdPartyApiContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ApiProvider>
      <App />
    </ApiProvider>
  </AuthProvider>,
);
