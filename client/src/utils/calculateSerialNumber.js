export const calculateSerialNumber = (currentPage = 1, index, limit = 10) => {
  return (currentPage - 1) * limit + index + 1;
};
