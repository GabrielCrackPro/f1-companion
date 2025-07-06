const getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale;
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  const formatted = d.toLocaleDateString(getLocale(), {
    day: "2-digit",
    month: "2-digit",
  });

  return formatted;
};

export const formatTime = (time: string) => {
  if (!time) return "";
  const date = new Date(`1970-01-01T${time}`);
  if (isNaN(date.getTime())) return "";

  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};
