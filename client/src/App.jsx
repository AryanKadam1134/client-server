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
import AddEditEducation from "./pages/private/educations/AddEditEducation";

import Certificates from "./pages/private/certificates/Certificates";
import AddEditCertificate from "./pages/private/certificates/AddEditCertificate";

import Achievements from "./pages/private/achievements/Achievements";
import AddEditAchievement from "./pages/private/achievements/AddEditAchievement";

import Settings from "./pages/private/Settings";

import { useAuth } from "./context/AuthContext";
import ChangePassword from "./pages/private/ChangePassword";

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

          <Route path="/educations" element={<CommonLayout />}>
            <Route index element={<Educations />} />
            <Route path="add" element={<AddEditEducation />} />
            <Route path=":educationId/edit" element={<AddEditEducation />} />
          </Route>

          <Route path="/certificates" element={<CommonLayout />}>
            <Route index element={<Certificates />} />
            <Route path="add" element={<AddEditCertificate />} />
            <Route
              path=":certificateId/edit"
              element={<AddEditCertificate />}
            />
            ,
          </Route>

          <Route path="/achievements" element={<CommonLayout />}>
            <Route index element={<Achievements />} />
            <Route path="add" element={<AddEditAchievement />} />
            <Route
              path=":achievementId/edit"
              element={<AddEditAchievement />}
            />
          </Route>

          <Route path="/settings" element={<CommonLayout />}>
            <Route index element={<Settings />} />
            <Route path="change_password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
