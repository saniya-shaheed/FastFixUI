export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const yy = String(date.getFullYear());
  return `${dd}-${mm}-${yy}`;
};
