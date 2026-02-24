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

const options = {
  httpOnly: true,
  secure: true,
};

const DB_NAME = "portfolio_backend";

export { SOCIAL_PLATFORMS, SKILL_LEVEL, GENDERS, DB_NAME, options };
