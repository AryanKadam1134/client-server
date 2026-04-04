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
import SocialPlatforms from "./pages/private/SocialPlatforms";
import Skills from "./pages/private/Skills";
import SkillCategories from "./pages/private/SkillCategories";
import Projects from "./pages/private/Projects";
import Experiences from "./pages/private/Experiences";
import Educations from "./pages/private/Educations";
import Certificates from "./pages/private/Certificates";
import Achievements from "./pages/private/Achievements";

function PublicRoute() {
  const { user } = useAuth();

  // ❌ If logged in → redirect to details
  return user ? <Navigate to="/details" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Restoring Session...
      </div>
    );
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
          <Route path="/social" element={<SocialPlatforms />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skill-categories" element={<SkillCategories />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/education" element={<Educations />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
