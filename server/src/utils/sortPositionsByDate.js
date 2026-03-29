export const sortPositionsByDate = (positions = []) => {
  return positions.sort((a, b) => {
    if (a.present) return -1;
    if (b.present) return 1;
    return new Date(b.startDate) - new Date(a.startDate);
  });
};
