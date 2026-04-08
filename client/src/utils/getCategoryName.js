export const getCategoryName = (categories, _id) => {
  return categories?.find((c) => c?.value === _id)?.label;
};
