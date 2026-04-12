export const getEmploymentType = (employmentTypes, value) => {
  return employmentTypes?.find((c) => c?.value === value)?.label || null;
};
