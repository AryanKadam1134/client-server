import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Dashboard from "./pages/private/Dashboard";
import Authentication from "./pages/authentication/Authentication";
import { useAuth } from "./context/AuthContext";

function PublicRoute() {
  const { user } = useAuth();

  // ❌ If logged in → redirect to admin
  return user ? <Navigate to="/admin" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />

        {/* 🔓 Public Route (only if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Authentication />} />
        </Route>

        {/* 🔐 Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
