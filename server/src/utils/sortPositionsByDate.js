export const sortPositionsByDate = (positions = []) => {
  return positions.sort((a, b) => {
    if (a.isCurrent) return -1;
    if (b.isCurrent) return 1;
    return new Date(b.startDate) - new Date(a.startDate);
  });
};
