export const getSkillLevel = (skillLevels, value) => {
  return skillLevels?.find((c) => c?.value === value)?.label || null;
};
