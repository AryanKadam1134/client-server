const SOCIAL_PLATFORMS = [
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Instagram", value: "instagram" },
];

const SKILL_LEVEL = [
  { label: "Basic", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advance", value: "advance" },
];

const GENDERS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const PROJECT_CATEGORIES = [
  { label: "Personal", value: "personal" },
  { label: "Freelance", value: "freelance" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Client", value: "client" },
  { label: "Open Source", value: "open-source" },
];

const EMPLOYMENT_TYPE = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
  { label: "Internship", value: "internship" },
  { label: "Apprenticeship", value: "apprenticeship" },
];

const VISIBILITY = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

const options = {
  httpOnly: true, // set to true in production
  secure: false,
};

const DB_NAME = "portfolio_backend";

export {
  SOCIAL_PLATFORMS,
  SKILL_LEVEL,
  GENDERS,
  PROJECT_CATEGORIES,
  EMPLOYMENT_TYPE,
  VISIBILITY,
  DB_NAME,
  options,
};
