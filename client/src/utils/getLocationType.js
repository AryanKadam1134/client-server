export const getLocationType = (locationTypes, value) => {
  return locationTypes?.find((c) => c?.value === value)?.label || null;
};
