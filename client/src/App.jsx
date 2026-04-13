import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Authentication from "./pages/authentication/Authentication";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/private/Dashboard";

import SocialPlatforms from "./pages/private/social_platforms/SocialPlatforms";
import AddEditSocialPlatform from "./pages/private/social_platforms/AddEditSocialPlatform";

import Skills from "./pages/private/skills/Skills";
import AddEditSkills from "./pages/private/skills/AddEditSkills";

import SkillCategories from "./pages/private/skill_categories/SkillCategories";
import AddEditSkillCategory from "./pages/private/skill_categories/AddEditSkillCategory";

import Projects from "./pages/private/projects/Projects";
import AddEditProject from "./pages/private/projects/AddEditProject";

import Experiences from "./pages/private/experiences/Experiences";
import AddEditExperiences from "./pages/private/experiences/AddEditExperiences";

import Educations from "./pages/private/educations/Educations";

import Certificates from "./pages/private/Certificates";
import Achievements from "./pages/private/Achievements";

import { useAuth } from "./context/AuthContext";

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

          <Route path="/experiences" element={<CommonLayout />}>
            <Route index element={<Experiences />} />
            <Route path="add" element={<AddEditExperiences />} />
            <Route path=":experienceId/edit" element={<AddEditExperiences />} />
          </Route>

          <Route path="/education" element={<Educations />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
