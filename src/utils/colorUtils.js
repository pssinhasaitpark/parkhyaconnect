export const getColorFromName = (name) => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#33FFF5'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
