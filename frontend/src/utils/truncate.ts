export const truncate = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return text.slice(0, text.lastIndexOf(" ", limit)) + "...";
};
