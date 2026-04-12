export const getVisibility = (visibilities, value) => {
  return visibilities?.find((c) => c?.value === value)?.label || null;
};
