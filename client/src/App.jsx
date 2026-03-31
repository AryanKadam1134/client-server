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
import DashboardLayout from "./layouts/DashboardLayout";

function PublicRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="text-xl font-semibold">Restoring Session...</div>;
  }

  // ❌ If logged in → redirect to details
  return user ? <Navigate to="/details" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="text-xl font-semibold">Restoring Session...</div>;
  }

  return user ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/auth" replace />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/details" />} />

        {/* 🔓 Public Route (only if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Authentication />} />
        </Route>

        {/* 🔐 Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/details" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
