import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/private/Dashboard";
import Authentication from "./pages/authentication/Authentication";
import SocialPlatforms from "./pages/private/SocialPlatforms";
import Skills from "./pages/private/Skills";
import SkillCategories from "./pages/private/SkillCategories";
import Projects from "./pages/private/Projects";
import Experiences from "./pages/private/Experiences";
import Educations from "./pages/private/Educations";
import Certificates from "./pages/private/Certificates";
import Achievements from "./pages/private/Achievements";
import AddEditSkills from "./pages/private/AddEditSkills";
import AddEditSkillCategory from "./pages/private/AddEditSkillCategory";
import AddEditSocialPlatform from "./pages/private/AddEditSocialPlatform";

import { useAuth } from "./context/AuthContext";
import AddEditProject from "./pages/private/AddEditProject";

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

function CommonLayout() {
  return <Outlet />;
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

          <Route path="/social" element={<CommonLayout />}>
            <Route index element={<SocialPlatforms />} />
            <Route path="add" element={<AddEditSocialPlatform />} />
            <Route
              path=":platformId/edit"
              element={<AddEditSocialPlatform />}
            />
          </Route>

          <Route path="/skills" element={<CommonLayout />}>
            <Route index element={<Skills />} />
            <Route path="add" element={<AddEditSkills />} />
            <Route path=":skillId/edit" element={<AddEditSkills />} />
          </Route>

          <Route path="/skill-categories" element={<CommonLayout />}>
            <Route index element={<SkillCategories />} />
            <Route path="add" element={<AddEditSkillCategory />} />
            <Route path=":categoryId/edit" element={<AddEditSkillCategory />} />
          </Route>

          <Route path="/projects" element={<CommonLayout />}>
            <Route index element={<Projects />} />
            <Route path="add" element={<AddEditProject />} />
            <Route path=":projectId/edit" element={<AddEditProject />} />
          </Route>

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
