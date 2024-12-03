export const apiImageURL = (photoId: string | undefined) => {
  if (!photoId) return "/imagePlaceholder.svg";
  return `${process.env.NEXT_PUBLIC_APP1_URL}/photo/${photoId}`;
};
