export const getCategoryName = (categories, value) => {
  return categories?.find((c) => c?.value === value)?.label || null;
};
