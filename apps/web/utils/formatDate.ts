export const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  const now = new Date();

  if (dateObj.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  }).format(dateObj);
};
