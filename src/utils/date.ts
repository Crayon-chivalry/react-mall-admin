export const formatLocalTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString();
};
