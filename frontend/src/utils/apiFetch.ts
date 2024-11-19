export const apiFetch = async (url: string, method: "GET" | "POST") => {
  return await fetch(url);
};
